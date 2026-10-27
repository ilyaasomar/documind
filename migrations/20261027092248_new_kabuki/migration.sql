ALTER TABLE "documents" ALTER COLUMN "file_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "file_type";--> statement-breakpoint
CREATE TYPE "file_type" AS ENUM('pdf', 'docx', 'xlsx', 'txt');--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "file_type" SET DATA TYPE "file_type" USING "file_type"::"file_type";--> statement-breakpoint
ALTER TABLE "message_citations" DROP CONSTRAINT "message_citations_document_id_documents_id_fkey", ADD CONSTRAINT "message_citations_document_id_documents_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "message_citations" DROP CONSTRAINT "message_citations_chunk_id_chunks_id_fkey", ADD CONSTRAINT "message_citations_chunk_id_chunks_id_fkey" FOREIGN KEY ("chunk_id") REFERENCES "chunks"("id") ON DELETE CASCADE;