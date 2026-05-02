# Task 05: Deployment & Launch (AI-Driven)

**AI Context & Dependencies:**
- **Required Complete**: All previous tasks (01, 02, 03, 04).
- **Read Docs**: `docs/architecture/01-overview.md`, `docs/architecture/07-testing.md`, `docs/architecture/09-troubleshooting.md`
- **Goal**: Finalize CI/CD, harden the production environment, and ensure full-stack E2E verification.

## 5.1 CI/CD Workflow
- [ ] Create `.github/workflows/main.yml`.
- [ ] Implement a workflow that runs on `push` and `pull_request`.
- [ ] Steps must include: `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test` (with coverage upload), and `pnpm test:e2e`.
- [ ] **AI Verification**: Locally run `pnpm lint`, `pnpm format:check` (if applicable), and `pnpm test` from the root to simulate the CI environment.

## 5.2 Production Hardening
- [ ] Review `apps/server/src/index.ts` and add Helmet middleware for secure headers (CSP).
- [ ] Review environment variable usage (`PORT`, `FRONTEND_URL`, `PUBLIC_BACKEND_URL`, `NODE_ENV`) across both `apps/server` and `apps/web`. Ensure fallbacks are correct.
- [ ] Implement robust error boundaries in the SvelteKit frontend `+error.svelte`.

## 5.3 E2E Testing (Playwright)
- [ ] Install Playwright in the root or dedicated `apps/e2e` workspace.
- [ ] Create critical path E2E tests: `tests/e2e/happy-path.spec.ts`. Must cover: Create match, join match, play valid moves, win a local board, and handle a disconnect/reconnect.
- [ ] Configure Playwright for both Desktop Chromium and Mobile Safari viewports.
- [ ] **AI Verification**: Run `pnpm test:e2e` (requires both dev servers running locally or a built preview).

## 5.4 Final Checks
- [ ] Verify `docs/README.md` correctly links to all new architecture and task files.
- [ ] Ensure all `TODO`s in the codebase are resolved.
