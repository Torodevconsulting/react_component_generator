# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install deps, generate Prisma client, run migrations
npm run setup

# Dev server (npm script broken on Windows — use this instead)
NODE_OPTIONS='--require ./node-compat.cjs' npx next dev --turbopack

# Build
NODE_OPTIONS='--require ./node-compat.cjs' npx next build

# Run all tests
npm test

# Run a single test file
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx

# Reset database
npm run db:reset
```

> `node-compat.cjs` is required on Node 25+ — it deletes `globalThis.localStorage/sessionStorage` to prevent SSR errors. The `npm run dev` script uses Unix env syntax and will fail on Windows; run the command directly as shown above.

## Architecture

UIGen is an AI-powered React component generator with live preview. Users describe a UI in chat → Claude generates/edits files via tool calls → a sandboxed iframe renders the result in real time.

### Data Flow

1. **Chat** (`/app/api/chat/route.ts`) — receives `{ messages, files, projectId }`, hydrates a `VirtualFileSystem` from serialized files, calls `streamText()` with Claude Haiku 4.5, and streams back tool calls + tokens.
2. **Tools** — Claude uses two tools: `str_replace_editor` (view/create/edit files) and `file_manager` (rename/delete). Tool call results are intercepted client-side by `FileSystemProvider`.
3. **Virtual FS** (`/lib/file-system.ts`) — in-memory `VirtualFileSystem` class; no disk I/O. Serialized as JSON and stored in `Project.data` (SQLite via Prisma) on each response finish.
4. **Preview** (`/components/preview/PreviewFrame.tsx`) — watches `refreshTrigger` from `FileSystemContext`, compiles JSX with Babel standalone at runtime, builds an import map of blob URLs, and renders in a sandboxed iframe. Entry point is always `/App.jsx`.

### State Management

Two React contexts carry all client state:

- **`ChatProvider`** (`/lib/contexts/chat-context.tsx`) — wraps `useChat()` from `@ai-sdk/react`; intercepts tool call results and delegates file mutations to `FileSystemProvider`.
- **`FileSystemProvider`** (`/lib/contexts/file-system-context.tsx`) — owns the `VirtualFileSystem` instance, executes tool calls, fires `refreshTrigger` for the preview, and auto-selects `App.jsx` after changes.

### Authentication

JWT-based. `createSession/getSession/verifySession/deleteSession` live in `/lib/auth.ts`. Token is stored in an httpOnly cookie (7-day expiry, HS256, secret from `JWT_SECRET` env var). Middleware (`middleware.ts`) guards `/api/projects` and `/api/filesystem`. All DB access goes through server actions in `/actions/`.

### AI Provider

`/lib/provider.ts` returns Claude Haiku 4.5 if `ANTHROPIC_API_KEY` is set, otherwise a `MockLanguageModel` that returns static component templates. The system prompt lives in `/lib/prompts/generation.tsx` and is sent with Anthropic's ephemeral prompt caching to reduce costs.

### Database

SQLite via Prisma. Two models:
- `User` — email + bcrypt-hashed password.
- `Project` — `messages` (JSON array) and `data` (serialized VirtualFileSystem) stored as strings. `userId` is optional to support anonymous sessions.

Anonymous work is tracked in localStorage via `/lib/anon-work-tracker.ts`.
