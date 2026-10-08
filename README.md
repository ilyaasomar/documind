# Documind

Ask questions about your company's documents and get answers with the page they came from.

A company uploads its contracts, policies and invoices. Anyone on the team can then ask something like "What is the notice period in the supplier agreement?" and get an answer that comes only from those files, with a link to the page.

## Why it exists

Company knowledge sits in PDFs that nobody reads. To find one sentence, you open five files and scroll, or you ask the colleague who remembers.

A normal chatbot cannot help, because it has never seen your contracts. It will still give an answer, and the answer may be wrong. Documind only uses the files in the workspace, and it shows the source, so you can check it yourself.

## What you can do with it

**Upload documents.** PDF, Word and plain text files, up to 50MB. The file is saved in private storage. The app reads the text, cuts it into small passages and prepares them for search. If you upload the same file twice, the app tells you it is already there.

**Ask questions.** Each chat is about one document. The app finds the passages that match your question and gives only those to the AI model.

**Check the answer.** Every answer shows which document and which page it came from. If the document does not contain the answer, the app says so instead of inventing one.

**Work as a team.** You create a workspace when you sign up and invite your colleagues as owner, admin or member. Documents belong to the whole workspace; your chats stay private to you.

## How it works

```
When you upload                     When you ask
───────────────                     ────────────
file ─► private storage (R2)        question ─► numbers (embedding)
  │                                               │
  └─► read the text, page by page                 ▼
      cut it into passages                 find the closest passages
      turn each passage into numbers ────► in the database
      save them in Postgres                       │
                                                  ▼
                                      passages + question ─► AI model
                                                  │
                                                  ▼
                                      answer + page number
```

**What "numbers" means here.** Every passage is turned into a list of numbers that describes its meaning. Passages with a similar meaning get similar numbers. So the question "How much notice must I give?" finds the sentence "either party may terminate with three months written notice", even though the two do not share a single word. That is why the search works better than searching for keywords.

**Reading a document takes time**, so the app does it in the background. You can close the upload window and the work continues on the server. The progress (reading the text → preparing the search → ready) is saved in the database, so you still see the correct status after a refresh or on another computer.

## Tech stack

| Area      | Choice                                               |
| --------- | ---------------------------------------------------- |
| Framework | Next.js 16 (App Router), React 19, TypeScript        |
| UI        | Tailwind v4, shadcn/ui on Base UI                    |
| Database  | Neon Postgres with pgvector, Drizzle ORM             |
| Auth      | better-auth                                          |
| Storage   | Cloudflare R2, private bucket                        |
| AI        | Vercel AI SDK with OpenAI (`text-embedding-3-small`) |

## Running it locally

You need: Node 20+, pnpm, a Neon database, a Cloudflare R2 bucket and an OpenAI API key.

```bash
pnpm install
```

Create a `.env` file:

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

In the R2 bucket, allow `PUT` and `GET` from `http://localhost:3000` in the CORS settings. Without this, the browser cannot upload.

Create the database tables (the first migration turns on pgvector):

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
  (auth)/            sign in, sign up
  onboarding/        create the workspace
  (dashboard)/       dashboard, documents, chats, settings
  api/               auth, workspace, documents, status, conversation
components/          navbar, sidebar, ui/ (shadcn)
db/                  schema.ts, relations.ts, index.ts
lib/                 auth, r2, embeddings, actions/
```
