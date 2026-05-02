# Task 03: Multiplayer Backend (AI-Driven)

**AI Context & Dependencies:**
- **Required Complete**: Task 01, Task 02
- **Read Docs**: `docs/architecture/04-backend.md`, `docs/architecture/06-security.md`
- **Target Directory**: `apps/server/src/`
- **Goal**: Implement robust room management, Socket.io event handlers, authoritative move checking, and security middleware.

## 3.1 Matchmaking & Room State
- [ ] Create `apps/server/src/managers/MatchManager.ts`.
- [ ] Implement an in-memory store mapping Room IDs (UUIDs) to `GameState`.
- [ ] Implement helper methods: `createMatch()`, `joinMatch()`, `getMatch()`, `removeMatch()`.
- [ ] **AI Verification**: Write basic unit tests for `MatchManager` in `apps/server/src/managers/__tests__/MatchManager.test.ts`.

## 3.2 Socket Connection & Security
- [ ] Update `apps/server/src/index.ts`.
- [ ] Implement rate limiting middleware for Socket.io (reference `06-security.md`).
- [ ] Configure CORS for both development (localhost) and production (`process.env.FRONTEND_URL`).
- [ ] Implement session assignment and connection logging.
- [ ] Implement `heartbeat` (ping-pong) logic to detect stale connections.

## 3.3 Event Handlers
- [ ] Create `apps/server/src/handlers/matchHandlers.ts`.
- [ ] Implement `join_match` event: Add socket to room, emit `match_ready` if full, sync full `GameState` to client.
- [ ] Implement `make_move` event: 
    - Retrieve game state.
    - Use `isValidMove` (from `packages/shared`).
    - If valid: Use `applyMove`, update store, and broadcast `game_update`.
    - If invalid: Emit `error` with specific code (reference `06-security.md`).
- [ ] Implement `disconnect` event: Handle player drops, emit `player_left` to opponent, clean up empty rooms after timeout.
- [ ] **AI Verification**: Write integration tests using `socket.io-client` in `apps/server/src/__tests__/integration.test.ts`. Run `pnpm --filter server test`.
