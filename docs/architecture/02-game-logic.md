# 02 - Game Logic: Ultimate Tic-Tac-Toe Rules & State

## The Grid Structure
Ultimate Tic-Tac-Toe is played on a **9x9 grid**.
-   The 9x9 grid is composed of 9 **Local Boards** (each is a 3x3 grid).
-   The 9 Local Boards are arranged in a 3x3 **Global Board**.

## Core Rules

### 1. Winning a Local Board
A player wins a local board by getting three of their marks (X or O) in a row, column, or diagonal within that 3x3 grid. Once a local board is won, it is marked with the winner's symbol and no more moves can be played in it.

### 2. The Move Constraint (The "Ultimate" Rule)
This is the central mechanic:
-   A player's move determines which local board their opponent must play in next.
-   If Player A plays in the **top-right cell** of a local board, Player B **must** play their next move in the **top-right local board** of the global grid.

### 3. Open Local Boards
If a player is sent to a local board that has already been won or is full (a draw), that player is granted a "Free Move" and can play in **any** available cell on the entire 9x9 grid.

### 4. Winning the Global Board
The game is won when a player wins three local boards in a row, column, or diagonal on the 3x3 Global Board.

## State Management

### Game State Object
The authoritative state is managed by the backend and synchronized with the frontend.
```typescript
interface GameState {
  globalBoard: (Player | 'DRAW' | null)[]; // 3x3 representation
  localBoards: Cell[][]; // 9 instances of 3x3 grids
  nextTargetBoard: number | null; // Index of the board the next player must play in
  activePlayer: Player;
  winner: Player | 'DRAW' | null;
}
```

### Validation Flow
1.  **Client Move**: Player clicks a cell. Frontend validates locally for immediate feedback.
2.  **Server Submission**: Move is sent to the backend via WebSockets.
3.  **Authoritative Check**: Backend verifies:
    - Is it the player's turn?
    - Is the move in the correct local board?
    - Is the cell empty?
4.  **Broadcast**: If valid, the backend updates the state and broadcasts the move to all connected players in the match.
