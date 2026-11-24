ALTER TABLE "organization" ADD COLUMN "uploaded_bytes" bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "question_used" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "usage_reset_at" timestamp DEFAULT now() NOT NULL;