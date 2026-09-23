"use server";
import { db } from "@/db";
import { documents, fileTypeEnum } from "@/db/schema";
import { createHash } from "crypto";
import { and, eq } from "drizzle-orm";
import { deleteObject, uploadObject } from "../r2";

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
