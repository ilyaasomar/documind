import { db } from "@/db";
import { chunks, documents, fileTypeEnum, organization } from "@/db/schema";
import { createHash } from "crypto";
import { and, eq } from "drizzle-orm";
import { deleteObject, getObject, uploadObject } from "../r2";

import { extractText, getDocumentProxy } from "unpdf";
import { generateEmbeddings } from "./embeddings";

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
    console.log("BUFFER", buffer);
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

    // now chunk the text
    const chunkList = chuckPage(pages);

    const sizes = chunkList.map((c) => c.content.length);
    console.log("chunks:", chunkList.length, "biggest:", Math.max(...sizes));

    // console.log(["Processed chunks", chunks]);
    await db
      .update(documents)
      .set({
        stage: "embedding",
        progress: 50,
        pageCount: pages.length,
      })
      .where(eq(documents.id, documentId));

    const vectors = await generateEmbeddings(
      chunkList.map((chunk) => chunk.content),
    );
    await db
      .update(documents)
      .set({ stage: "indexing", progress: 90 })
      .where(eq(documents.id, documentId));

    // re-processing must not duplicate chunks
    await db.delete(chunks).where(eq(chunks.documentId, documentId));
    await db.insert(chunks).values(
      chunkList.map((chunk, index) => ({
        documentId: documentId,
        organizationId: document.organizationId,
        chunkIndex: chunk.chunkIndex,
        content: chunk.content,
        pageNumber: chunk.pageNumber,
        embedding: vectors[index].embedding,
      })),
    );

    await db
      .update(documents)
      .set({ status: "ready", stage: null, progress: 100 })
      .where(eq(documents.id, documentId));
  } catch (error) {
    // the file encountered an error so delete it from R2 and db
    const [document] = await db
      .select({ storageKey: documents.storageKey })
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);
    if (document.storageKey) {
      await deleteObject(document.storageKey).catch(() => {});
    }
    // await db.delete(documents).where(eq(documents.id, documentId));
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
    console.log("BDF EXTRACT", pdf);
    const { text } = await extractText(pdf, { mergePages: false });
    console.log("TEXT EXTRACT", text);
    console.log(
      "What loops returns",
      text.map((pageText, index) => ({ page: index + 1, text: pageText })),
    );
    return text.map((pageText, index) => ({ page: index + 1, text: pageText }));
  }

  // txt and md have no pages

  return [{ page: 1, text: buffer.toString("utf8") }];
}

type Chunk = { content: string; pageNumber: number; chunkIndex: number };
const CHUNK_SIZE = 1000;
const OVERLAP = 150;

export function chuckPage(pages: Page[]): Chunk[] {
  const chunks: Chunk[] = [];

  for (const page of pages) {
    const text = page.text.replace(/\s+/g, " ").trim();

    for (let start = 0; start < text.length; start += CHUNK_SIZE - OVERLAP) {
      const content = text.slice(start, start + CHUNK_SIZE).trim();

      if (content.length > 30) {
        chunks.push({
          content,
          pageNumber: page.page,
          chunkIndex: chunks.length,
        });
      }
    }
  }

  return chunks;
}
