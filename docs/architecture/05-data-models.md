# 05 - Data Models & Domain Entities

## Overview

This document defines the core data structures used throughout the application. These models are shared between the SvelteKit frontend and the Node.js backend to ensure consistency.

## Core Domain Models (TypeScript)

### Player

```typescript
type PlayerSymbol = 'X' | 'O';

interface Player {
  id: string;
  username: string;
  symbol: PlayerSymbol;
}
```

### Game Cell

```typescript
type CellValue = PlayerSymbol | null;

interface Cell {
  x: number; // 0-2 within local board
  y: number; // 0-2 within local board
  value: CellValue;
}
```

### Local Board

```typescript
interface LocalBoard {
  id: number; // 0-8
  cells: Cell[][]; // 3x3 grid
  winner: PlayerSymbol | 'DRAW' | null;
}
```

### Global Game State

```typescript
interface GameState {
  matchId: string;
  globalBoard: (PlayerSymbol | 'DRAW' | null)[]; // 3x3 status of each local board
  localBoards: LocalBoard[]; // 9 local boards
  nextTargetBoard: number | null; // index (0-8) or null if "Free Move"
  activePlayer: PlayerSymbol;
  status: 'WAITING' | 'PLAYING' | 'FINISHED';
  winner: PlayerSymbol | 'DRAW' | null;
  history: Move[];
}
```

### Move

```typescript
interface Move {
  playerId: string;
  boardIndex: number; // 0-8 (which local board)
  cellX: number; // 0-2
  cellY: number; // 0-2
  timestamp: Date;
}
```

## Database Schema (Optional/Persistent)

If a database is implemented (e.g., PostgreSQL on Railway), the following tables would be used:

1.  **Users**: `id`, `username`, `email`, `password_hash`, `elo_rating`, `games_played`, `wins`.
2.  **Matches**: `id`, `player1_id`, `player2_id`, `winner_id`, `start_time`, `end_time`.
3.  **MoveHistory**: `match_id`, `player_id`, `move_data` (JSON), `move_order`.

## Serialization

- All data transmitted via WebSockets is serialized as JSON.
- The `GameState` is optimized to only send diffs or the minimal required data to reduce bandwidth, although for Tic-Tac-Toe, sending the full object is usually acceptable.
