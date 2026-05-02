# Task 01: Infrastructure & Shared Foundations (AI-Driven)

**AI Context & Dependencies:**
- **Read Docs**: `docs/architecture/01-overview.md`, `docs/architecture/08-development-setup.md`, `docs/architecture/05-data-models.md`
- **Goal**: Establish the Turborepo monorepo, initialize standard tooling, and define core TypeScript models.

## 1.1 Monorepo Initialization
- [x] Initialize a new Git repository at the project root.
- [x] Create `package.json` at root with `pnpm` workspaces configured for `apps/*` and `packages/*`.
- [x] Create `pnpm-workspace.yaml`.
- [x] Create `turbo.json` with standard build, lint, typecheck, and dev pipelines.

## 1.2 Shared Package (`packages/shared`)
- [x] Create `packages/shared/package.json` with standard TypeScript configuration.
- [x] Create `packages/shared/tsconfig.json`.
- [x] **Data Models**: Create `packages/shared/src/types/index.ts` and implement the models from `docs/architecture/05-data-models.md` (`Player`, `Cell`, `LocalBoard`, `GameState`, `Move`).
- [x] **Export**: Ensure all types are explicitly exported from `packages/shared/src/index.ts`.
- [x] **AI Verification**: Run `pnpm --filter shared typecheck` (or equivalent compilation step) to ensure no errors.

## 1.3 Backend Skeleton (`apps/server`)
- [x] Create `apps/server/package.json`. Add dependencies: `express`, `socket.io`, `cors`, `dotenv`, `helmet`, `express-rate-limit`. Add devDependencies: `typescript`, `@types/express`, `tsx`.
- [x] Add `"shared": "workspace:*"` to `apps/server` dependencies.
- [x] Create `apps/server/tsconfig.json`.
- [x] Create `apps/server/src/index.ts` with a basic Express + Socket.io skeleton (no game logic yet).
- [x] **AI Verification**: Run `pnpm --filter server typecheck`.

## 1.4 Frontend Skeleton (`apps/web`)
- [x] Initialize SvelteKit app in `apps/web` (configure for TypeScript).
- [x] Add `"shared": "workspace:*"` to `apps/web` dependencies.
- [x] Install `socket.io-client` in `apps/web`.
- [x] **AI Verification**: Run `pnpm --filter web check` to verify Svelte types.
