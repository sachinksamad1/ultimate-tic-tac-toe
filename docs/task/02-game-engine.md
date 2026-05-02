# Task 02: Core Game Engine (AI-Driven)

**AI Context & Dependencies:**
- **Required Complete**: Task 01
- **Read Docs**: `docs/architecture/02-game-logic.md`, `docs/architecture/07-testing.md`
- **Target Directory**: `packages/shared/src/engine/`
- **Goal**: Implement pure, side-effect-free game logic functions and exhaustively test them. Zero tolerance for bugs here.

## 2.1 Engine Setup & Win Conditions
- [ ] Create `packages/shared/src/engine/winConditions.ts`.
- [ ] Implement `checkLineWin(cells)` to identify 3-in-a-row.
- [ ] Implement `checkLocalWin(board)` to evaluate a 3x3 local board for win/draw.
- [ ] Implement `checkGlobalWin(globalBoard)` to evaluate the overall 9x9 state.
- [ ] Create `packages/shared/src/engine/__tests__/winConditions.test.ts` matching the specs in `07-testing.md`.
- [ ] **AI Verification**: Run `pnpm --filter shared test` and ensure 100% pass rate.

## 2.2 Move Validation
- [ ] Create `packages/shared/src/engine/validation.ts`.
- [ ] Implement `isValidMove(state: GameState, move: Move): boolean` adhering to the "Ultimate Rule" and "Free Move" conditions.
- [ ] Create `packages/shared/src/engine/__tests__/validation.test.ts`. Include test cases for occupied cells, wrong turns, wrong target boards, and free moves.
- [ ] **AI Verification**: Run tests.

## 2.3 State Transitions
- [ ] Create `packages/shared/src/engine/transitions.ts`.
- [ ] Implement `applyMove(state: GameState, move: Move): GameState` (must be an immutable state update).
- [ ] Include logic for updating `nextTargetBoard`, marking local board wins, checking for a global win, and appending to move history.
- [ ] Create `packages/shared/src/engine/__tests__/transitions.test.ts`.
- [ ] **AI Verification**: Run `pnpm --filter shared test --coverage`. Ensure engine coverage >90%.

## 2.4 Final Integration
- [ ] Export all engine functions from `packages/shared/src/index.ts` so they are accessible to the frontend and backend.
