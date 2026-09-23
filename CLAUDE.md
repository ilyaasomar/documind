@AGENTS.md

# DocuMind

A RAG app for teams: a company uploads documents (contracts, policies, invoices), then anyone in the company can ask questions in plain language. Every answer cites the page it came from.

This is a real product, not a demo. Owner: Ilyas (solo developer, learning while building).

## Commands

```bash
pnpm dev
```

```bash
pnpm build
```

```bash
pnpm lint
```

Database (Drizzle + Neon):

```bash
pnpm drizzle-kit generate
```

```bash
pnpm drizzle-kit migrate
```

```bash
pnpm drizzle-kit studio
```

Never use `drizzle-kit push`. The project uses generate + migrate only; mixing them breaks the migration history (it happened once already).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · shadcn/ui on **Base UI** (`style: base-vega`, not Radix) · **Drizzle ORM 1.0** + Neon Postgres + pgvector · better-auth · react-hook-form + zod · lucide-react.

Env vars: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_BRANCH`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`. R2 keys come later.

## Layout

```
app/
  (auth)/signin, (auth)/signup     auth pages + shared split-screen layout (blue panel on the right)
  onboarding/                      create workspace; OUTSIDE (dashboard) on purpose
  (dashboard)/layout.tsx           guard: session + membership, then sidebar + content
  (dashboard)/(routes)/            /, /documents, /chats, /settings
  api/auth/[...all]/               better-auth handler
  api/workspace/                   POST: create organization + owner member
  styles.ts                        brand colors (see Styling)
components/  navbar.tsx, sidebar.tsx, ui/ (shadcn)
db/          schema.ts, relations.ts, index.ts
lib/         auth.ts, auth-client.ts, actions/, routes.ts
```

Pages render `<Navbar title description>{buttons}</Navbar>` as their **first element** (a direct child of `SidebarInset`), then a padded `<div className="flex-1 p-4 sm:p-6">`. The layout must not render the navbar or add padding, or `sticky top-0` breaks.

## Data model (`db/schema.ts`)

12 tables in three groups:

- **better-auth:** `user`, `session`, `account`, `verification`
- **Teams (hand-written, no organization plugin):** `organization`, `member`, `invitation`
- **App:** `documents`, `chunks`, `conversations`, `messages`, `messageCitations`

Rules that must not be broken:

- **Id types:** tables better-auth writes use `text("id").primaryKey()` (it generates non-UUID string ids). Tables we write use `uuid("id").primaryKey().defaultRandom()`. So `userId` is always `text`, `organizationId` is always `uuid`.
- **Every company table carries `organizationId`** and every query filters by it. This is the only thing keeping one company's documents away from another's.
- `chunks.embedding` is `vector(1536)` with an HNSW index (`vector_cosine_ops`). The embedding model **must** output 1536 dimensions, or every document has to be processed again.
- `conversations` has `userId` **and** `documentId`: chats are **private to one person** and always about **exactly one document**. A document can have several conversations.
- `messageCitations` copies `documentName` and `quote`, so old answers still make sense after a document is deleted (`documentId`/`chunkId` are `set null`).
- Relations live in `db/relations.ts` using Drizzle 1.0's **`defineRelations`**. The old `relations()` API does not exist in this version.

## Auth and access

better-auth with email/password only, plus `nextCookies()`. The organization plugin is **deliberately not used**; organizations, members and invitations are our own tables and our own code, so the logic is debuggable.

Roles: `owner`, `admin`, `member`. Settings, invites and deleting other people's documents are owner/admin only.

Guards (server-side, in layouts and pages, never just hidden UI):

| Page | No session | Session, no workspace | Session + workspace |
| --- | --- | --- | --- |
| `/onboarding` | → `/signin` | show the form | → `/` |
| `/` and dashboard pages | → `/signin` | → `/onboarding` | show the page |

`/onboarding` lives outside the `(dashboard)` group because the dashboard guard redirects to it; nesting it caused an infinite redirect loop.

`lib/actions/get-user.ts` returns the session user or redirects to `/signin`.

## Upload pipeline (in progress)

`status`: uploading → processing → ready | failed. `stage`: extracting → embedding → indexing. `progress`: 0–100.

1. Browser asks the server to start an upload; server checks session/membership, creates the `documents` row and returns a **presigned R2 URL** (the server always decides `storageKey`: `orgs/{orgId}/documents/{docId}/original.pdf`).
2. Browser uploads straight to R2 (progress bar comes from here).
3. Browser tells the server it finished; the server answers immediately and processes in the background.
4. Processing: download → extract text (keep page numbers) → chunk (~800–1000 chars, ~150 overlap) → embed in batches → insert chunks → `ready`.
5. The UI polls a status route every ~2s. Progress lives in the database, so closing the modal or refreshing never loses it.

The upload modal shows **4 steps** (Uploading, Extracting, Generating embeddings, Indexing). While uploading, the window must stay open and the button says "Cancel upload"; once processing starts, it says "Close" and the work continues server-side. Failures are stored in `errorMessage`, not just logged.

Start with PDF and TXT. Duplicate uploads are caught with `contentHash`.

## Styling

- Brand colors live in **`app/styles.ts`** as full class strings (`styles.primaryBgColor`, `primaryHoverBgColor`, `primaryTextColor`, `primarySoftBgColor`, `primaryGradientBg`). Never build class names with `${}` fragments; Tailwind can only see complete strings.
- Everything else uses theme tokens (`text-muted-foreground`, `border`, `bg-card`), which are set to the design palette in `app/globals.css`. Primary is `#1d4f9c`.
- Use shadcn components rather than hand-rolled markup. They are Base UI based: `DropdownMenuTrigger`/`DropdownMenuItem` take a `render` prop instead of `asChild`.

## Conventions

- Server actions in `lib/actions/` for the app's own forms; API routes for things outside React (better-auth, polling, streaming, webhooks). Both start with the same session + role check; a server action is a public endpoint too.
- Keep comments sparse and practical, matching the existing files.
- Commits: Conventional Commits, one topic per commit, short subject in imperative mood (`feat(auth): add email/password sign-up`).

## Known gaps

- `lib/auth-client.ts` creates two clients; only `authClient` (with `baseURL`) is needed.
- Workspace creation fails if two companies pick the same name (`slug` is unique); needs a suffix.
- The onboarding form navigates to `/` even when the API call fails.
- Account deletion is unimplemented: an organization must always keep at least one owner, and deleting an organization must also delete its R2 files.
