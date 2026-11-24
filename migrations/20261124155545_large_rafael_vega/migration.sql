CREATE TABLE "plans" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"upload_bytes" bigint NOT NULL,
	"questions" integer NOT NULL
);

--> statement-breakpoint
INSERT INTO "plans" ("id", "name", "upload_bytes", "questions") VALUES
  ('free', 'Free', 20971520, 40),
  ('pro', 'Pro', 2147483648, 1000);