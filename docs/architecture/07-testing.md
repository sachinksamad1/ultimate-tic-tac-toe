# 07 - Testing Strategy

## Overview
This document defines the testing approach, tools, coverage targets, and CI integration for the Ultimate Tic-Tac-Toe project.

## Testing Pyramid

```
         /\
        /  \
       / E2E \        ← Playwright (critical user journeys)
      /______\
     /          \
    / Integration \   ← Supertest + socket.io-client (API + WS endpoints)
   /______________\
  /                \
 /     Unit Tests    \ ← Vitest (game engine, utilities, stores)
/____________________\
```

## Tooling

| Layer | Framework | Scope |
|-------|-----------|-------|
| **Unit** | Vitest | Game engine, validation logic, state transitions, utility functions, Svelte stores |
| **Integration** | Vitest + Supertest + socket.io-client | Express routes, WebSocket event handlers, room management |
| **E2E** | Playwright | Full game flow: join → play → win, reconnect, mobile viewport |

## Coverage Targets

| Module | Target | Rationale |
|--------|--------|-----------|
| Game engine (`checkWin`, `applyMove`, `isValidMove`) | **90%+** | Core logic, zero tolerance for bugs |
| Backend event handlers | **80%+** | Critical for multiplayer correctness |
| Frontend stores | **70%+** | Reactive logic, harder to unit test in isolation |
| UI components | **60%+** | Visual testing via E2E preferred |
| Utilities and helpers | **85%+** | Low complexity, easy to cover |

## Unit Test Cases

### Game Engine (`packages/shared` or `server/src/engine`)

#### Win Conditions
```typescript
describe('checkLineWin', () => {
  it('detects horizontal win', () => { ... });
  it('detects vertical win', () => { ... });
  it('detects diagonal win (top-left to bottom-right)', () => { ... });
  it('detects diagonal win (top-right to bottom-left)', () => { ... });
  it('returns null for incomplete line', () => { ... });
  it('returns null for mixed symbols', () => { ... });
});

describe('checkLocalWin', () => {
  it('detects win on a 3x3 board', () => { ... });
  it('detects draw when all cells filled with no winner', () => { ... });
  it('returns null for in-progress board', () => { ... });
});

describe('checkGlobalWin', () => {
  it('detects win across local board winners', () => { ... });
  it('detects global draw when all local boards resolved', () => { ... });
});
```

#### Move Validation
```typescript
describe('isValidMove', () => {
  it('accepts move in correct target board', () => { ... });
  it('rejects move in wrong target board', () => { ... });
  it('rejects move in occupied cell', () => { ... });
  it('rejects move when not player turn', () => { ... });
  it('accepts free move when target board is won', () => { ... });
  it('accepts free move when target board is drawn', () => { ... });
  it('rejects free move when played in won board', () => { ... });
  it('rejects free move when played in full board', () => { ... });
});
```

#### State Transitions
```typescript
describe('applyMove', () => {
  it('updates cell value correctly', () => { ... });
  it('switches active player after move', () => { ... });
  it('calculates nextTargetBoard from move position', () => { ... });
  it('marks local board as won after winning move', () => { ... });
  it('marks local board as draw when filled with no winner', () => { ... });
  it('marks global winner after third local win in line', () => { ... });
  it('records move in history with timestamp', () => { ... });
});
```

### Backend Event Handlers
```typescript
describe('Socket.io events', () => {
  describe('join_match', () => {
    it('creates new room when matchId is new', () => { ... });
    it('adds player to existing room', () => { ... });
    it('emits match_ready when second player joins', () => { ... });
    it('rejects join when room is full (2 players)', () => { ... });
  });

  describe('make_move', () => {
    it('broadcasts game_update on valid move', () => { ... });
    it('emits error on invalid move', () => { ... });
    it('rejects move from wrong player', () => { ... });
    it('rejects move after game ended', () => { ... });
  });

  describe('disconnect', () => {
    it('notifies opponent when player disconnects', () => { ... });
    it('cleans up room after both players disconnect', () => { ... });
  });
});
```

### Frontend Stores
```typescript
describe('gameStore', () => {
  it('updates state on game_update event', () => { ... });
  it('derives isMyTurn correctly', () => { ... });
  it('derives activeBoardIndex from nextTargetBoard', () => { ... });
  it('handles rollback on rejected move', () => { ... });
});
```

## Integration Testing

### Setup
```typescript
// test/helpers.ts
import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as ioc, Socket } from 'socket.io-client';

export function createTestServer() {
  const httpServer = createServer();
  const io = new Server(httpServer, { cors: { origin: '*' } });
  // Mount app logic onto io
  return { httpServer, io };
}

export function createTestClient(url: string): Socket {
  return ioc(url, { transports: ['websocket'] });
}
```

### Example Integration Test
```typescript
describe('Full match flow', () => {
  let server, io, client1, client2;

  beforeEach(async () => {
    ({ httpServer: server, io } = createTestServer());
    await new Promise<void>(r => server.listen(0, r));
    const port = (server.address() as AddressInfo).port;
    client1 = createTestClient(`http://localhost:${port}`);
    client2 = createTestClient(`http://localhost:${port}`);
  });

  afterEach(() => {
    client1.disconnect();
    client2.disconnect();
    server.close();
  });

  it('two players can complete a match', async () => {
    // Join match, play moves, verify winner
  });
});
```

## E2E Testing (Playwright)

### Critical User Journeys
1. **Happy path**: Player 1 creates match → Player 2 joins → Game played to completion → Winner displayed
2. **Reconnection**: Player disconnects mid-game → Reconnects → Game state restored → Play continues
3. **Mobile viewport**: Full game flow at 375x812 viewport (iPhone 13)
4. **Free move**: Trigger free move scenario → Player selects any available cell → Correct board targeted next
5. **Error handling**: Invalid move attempted → Error shown → UI remains in correct state

### Playwright Config
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'pnpm dev',
    port: 5173,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
```

## CI Integration

### GitHub Actions Workflow
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'pnpm' }
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test -- --coverage
      - run: pnpm test:e2e
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with: { fail_ci_if_error: true }
```

### Test Commands
| Command | Description |
|---------|-------------|
| `pnpm test` | Run all unit and integration tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm test:e2e:ui` | Run E2E tests with Playwright UI |

## Test Data & Fixtures

### Fixture Factory
```typescript
function createGameState(overrides = {}): GameState {
  return {
    matchId: 'test-match-1',
    globalBoard: Array(9).fill(null),
    localBoards: Array(9).fill(null).map((_, i) => ({
      id: i,
      cells: Array(3).fill(null).map(() => Array(3).fill(null)),
      winner: null,
    })),
    nextTargetBoard: null,
    activePlayer: 'X',
    status: 'PLAYING',
    winner: null,
    history: [],
    ...overrides,
  };
}
```

### Common Scenarios
- **Fresh game**: Empty board, X to play
- **Mid-game**: Partially filled boards, specific target
- **Won board**: One local board already won
- **Free move**: Target board won, player can play anywhere
- **Game over**: Winner determined, no more moves allowed
