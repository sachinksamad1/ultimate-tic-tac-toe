# Task 04: Frontend & UI (AI-Driven)

**AI Context & Dependencies:**
- **Required Complete**: Task 01, Task 02 (Task 03 is helpful but can be mocked if needed)
- **Read Docs**: `docs/architecture/03-frontend.md`, `docs/architecture/06-security.md`
- **Target Directory**: `apps/web/`
- **Goal**: Build reactive SvelteKit stores, accessible grid components, and connect seamlessly to the Socket.io backend.

## 4.1 State Stores
- [ ] Create `apps/web/src/lib/stores/socket.ts` to manage the singleton `socket.io-client` connection. Implement auto-reconnect logic.
- [ ] Create `apps/web/src/lib/stores/game.ts` (Svelte writable store) to hold the current `GameState`.
- [ ] Add derived properties to `gameStore`: `isMyTurn`, `activeBoardIndex`.
- [ ] **AI Verification**: Unit test the Svelte stores in `apps/web/src/lib/stores/__tests__/game.test.ts`.

## 4.2 Component Architecture & Accessibility
- [ ] Create `apps/web/src/lib/components/Cell.svelte`. Ensure ARIA labels, keyboard navigation (Enter/Space to click), and clear focus indicators.
- [ ] Create `apps/web/src/lib/components/LocalBoard.svelte`. Render 3x3 `Cell`s. Implement visual overlay for won/drawn status and highlight if it's the `nextTargetBoard`.
- [ ] Create `apps/web/src/lib/components/GlobalBoard.svelte`. Render 3x3 `LocalBoard`s. Use CSS Grid.
- [ ] Create `apps/web/src/lib/components/GameOverlay.svelte` to display game status (e.g., waiting for opponent, winner announcements).

## 4.3 Integration & Logic
- [ ] Create the main play route `apps/web/src/routes/play/[matchId]/+page.svelte`.
- [ ] Connect `gameStore` and `socketStore` to the route.
- [ ] Implement optimistic UI updates on move click (assume move is valid locally).
- [ ] Implement state rollback and toast notification if the server emits an `error` event.

## 4.4 Styling & Polish
- [ ] Add responsive CSS (Tailwind or scoped vanilla CSS) ensuring the 9x9 grid fits and is playable on mobile device widths.
- [ ] Implement minimal CSS transitions for board status changes, respecting `prefers-reduced-motion`.
- [ ] **AI Verification**: Run `pnpm --filter web build` and `pnpm --filter web check` to ensure the frontend compiles without errors.
