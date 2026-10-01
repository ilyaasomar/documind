# DocuMind

A team workspace for asking questions about your company's documents.

A company uploads its contracts, policies and invoices. Anyone on the team can then ask a question in plain language — "What is the notice period in the supplier agreement?" — and get an answer written only from those documents, with a citation pointing to the page it came from.

## The problem it solves

Company knowledge sits in PDFs nobody reads. Finding one clause means opening five files and scrolling, or asking a colleague who happens to remember.

A general chatbot doesn't help: it has never seen your contracts, and it will invent an answer that sounds right. DocuMind only answers from the files in the workspace, and shows the source, so the answer can be checked.

## What it does

**Upload documents.** PDF, Word and plain text, up to 50MB. The file goes into private storage; the app reads it, splits it into passages and indexes them for meaning-based search. Uploading the same file twice is detected and refused.

**Ask questions.** A conversation belongs to one document. The question is matched against the indexed passages, and the most relevant ones are given to the model as the only source for the answer.

**Check the source.** Every answer carries numbered citations with the document name and page. If nothing relevant is found, the app says so instead of guessing.

**Work as a team.** A workspace is created on sign-up; colleagues are invited into it with owner, admin or member roles. Documents belong to the workspace, chats stay private to the person who asked.

## How it works

```
Upload                             Ask
──────                             ───
file ─► private storage (R2)       question ─► embedding
  │                                              │
  └─► extract text, page by page                 ▼
      split into overlapping passages      vector search over the
      create an embedding per passage ───► workspace's passages
      store in Postgres (pgvector)               │
                                                 ▼
                                          passages + question ─► model
                                                 │
                                                 ▼
                                          answer + citations
```

An embedding is a list of numbers representing meaning, so "How much notice must I give?" matches a passage that says "either party may terminate with three months written notice", even though they share no words.

Processing runs **after** the upload response is sent, so the user can close the dialog and keep working. Progress (extracting → embedding → indexing → ready) is stored in the database and polled by the UI, so it survives a refresh or a different device.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind v4, shadcn/ui on Base UI |
| Database | Neon Postgres + pgvector, Drizzle ORM |
| Auth | better-auth  |
| Storage | Cloudflare R2, private bucket |
| AI | Vercel AI SDK with OpenAI (`text-embedding-3-small`, 1536 dimensions) |

## Data model

12 tables: four for authentication, three for teams (`organization`, `member`, `invitation`), five for the product (`documents`, `chunks`, `conversations`, `messages`, `message_citations`).

- Every company-owned table carries `organization_id`, and every query filters by it. That is what keeps one company's documents away from another's.
- `chunks.embedding` is `vector(1536)` with an HNSW index using cosine distance.
- A conversation belongs to exactly one document and one user: documents are shared with the workspace, chats are not.
- Citations store a copy of the document name and the quoted text, so old answers stay readable after a document is deleted.

## Running locally

Requirements: Node 20+, pnpm, a Neon database, a Cloudflare R2 bucket, an OpenAI API key.

```bash
pnpm install
```

Create `.env`:

```
DATABASE_URL=postgres://...
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=documind

OPENAI_API_KEY=sk-...
```

The R2 bucket needs a CORS rule allowing `PUT` and `GET` from `http://localhost:3000`.

Apply the schema (the first migration enables pgvector):

```bash
pnpm drizzle-kit migrate
```

Start the app:

```bash
pnpm dev
```

## Project structure

```
app/
  (auth)/            sign-in, sign-up
  onboarding/        create workspace
  (dashboard)/       dashboard, documents, chats, settings
  api/               auth, workspace, documents, document status, conversation
components/          navbar, sidebar, ui/ (shadcn)
db/                  schema.ts, relations.ts, index.ts
lib/                 auth, r2, embeddings, actions/
```

## Design decisions

**Teams are written by hand** rather than taken from an auth plugin. Organizations, members, invitations and the role checks are my own code, so every access rule is explicit and debuggable.

**Files never touch the database.** Postgres holds metadata, passages and embeddings; R2 holds the originals in a private bucket. The storage key is built on the server (`orgs/{orgId}/documents/{...}`) so the browser can never choose where a file is written.

**Processing is detached from the request.** It runs after the response as a single function that takes a document id, which means it can move to a job queue later without touching the rest of the app.

**Chunking is a fixed window with overlap**, not a sentence-aware splitter. The clever version produced a 66,000-character passage on a document without punctuation and broke the embedding call; the simple one cannot, and the quality difference is small.

**Page numbers travel with each passage.** Citations are the point of the product, so the extractor returns one entry per page and every passage remembers where it came from.

**Scanned PDFs are rejected** with a clear message instead of being stored as unsearchable files. OCR is out of scope.
