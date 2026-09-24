"use server";
import { db } from "@/db";
import { documents, fileTypeEnum } from "@/db/schema";
import { createHash } from "crypto";
import { and, eq } from "drizzle-orm";
import { deleteObject, getObject, uploadObject } from "../r2";

import { extractText, getDocumentProxy } from "unpdf";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

const ACCEPTED_TYPES: Record<string, (typeof fileTypeEnum.enumValues)[number]> =
  {
    "application/pdf": "pdf",
    "text/plain": "txt",
    "application/msword": "docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
  };
interface CreateDocumentProps {
  file: File;
  organizationId: string;
  userId: string;
}
// create document by uploading to R2 and inserting into db
export async function createDocument({
  file,
  organizationId,
  userId,
}: CreateDocumentProps) {
  // check file size
  if (file.size > MAX_SIZE) {
    throw new Error("This file is larger than 50MB.");
  }
  const fileType = ACCEPTED_TYPES[file.type];
  if (!fileType) {
    throw new Error("Only PDF, Word and plain text files are supported.");
  }

  // 2. read the file once, use it for the hash and the upload
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentHash = createHash("sha256").update(buffer).digest("hex");

  // 3. if same file already in this workspace
  const [existing] = await db
    .select()
    .from(documents)
    .where(
      and(
        eq(documents.organizationId, organizationId),
        eq(documents.contentHash, contentHash),
      ),
    )
    .limit(1);

  if (existing) {
    return { duplicate: true as const, document: existing };
  }

  // 4. upload to R2 first, so a failure leaves no row behind
  const storageKey = `orgs/${organizationId}/documents/${Date.now()}-${file.name}`;
  await uploadObject(storageKey, buffer, file.type);
  // 5. save the row
  try {
    const [document] = await db
      .insert(documents)
      .values({
        name: file.name,
        fileType,
        sizeBytes: file.size,
        storageKey,
        contentHash,
        organizationId,
        uploadedBy: userId,
        status: "processing",
        stage: "extracting",
        progress: 0,
      })
      .returning();
    return { duplicate: false as const, document };
  } catch (error) {
    await deleteObject(storageKey);
    throw error;
  }
}

// process document
export async function processDocument(documentId: string) {
  try {
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);

    if (!document) return;

    // 1. read the file from R2
    const buffer = await getObject(document.storageKey);

    // 2. extract the text page by page
    const pages = await extractPage(buffer, document.fileType);
    const characters = pages.reduce(
      (total, page) => total + page.text.length,
      0,
    );

    // 3. scan has already no text, so i have to stop
    if (characters < 50) {
      throw new Error(
        "This file has no readable text. Scanned documents are not supported yet.",
      );
    }
    console.log(
      `[processDocument] ${document.name}: ${pages.length} pages, ${characters} characters`,
    );
    console.log(pages[0].text.slice(0, 300)); // peek at page 1 while developing

    await db
      .update(documents)
      .set({
        pageCount: pages.length,
        progress: 45,
      })
      .where(eq(documents.id, documentId));

    // TODO next: chunk the pages, create embeddings, insert into `chunks`
  } catch (error) {
    await db
      .update(documents)
      .set({
        status: "failed",
        stage: null,
        errorMessage:
          error instanceof Error ? error.message : "Processing failed.",
      })
      .where(eq(documents.id, documentId));
  }
}

type Page = { page: number; text: string };

export async function extractPage(
  buffer: Buffer,
  fileType: string,
): Promise<Page[]> {
  if (fileType === "pdf") {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: false });
    return text.map((pageText, index) => ({ page: index + 1, text: pageText }));
  }
  // txt and md have no pages
  return [{ page: 1, text: buffer.toString("utf8") }];
}
