ALTER TABLE "organization" ADD COLUMN "plan_id" text DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "uploaded_bytes";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "question_used";--> statement-breakpoint
ALTER TABLE "organization" DROP COLUMN "usage_reset_at";--> statement-breakpoint
ALTER TABLE "organization" ADD CONSTRAINT "organization_plan_id_plans_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");