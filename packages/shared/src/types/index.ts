export type PlayerSymbol = 'X' | 'O';

export interface Player {
  id: string;
  username: string;
  symbol: PlayerSymbol;
}

export type CellValue = PlayerSymbol | null;

export interface Cell {
  x: number; // 0-2 within local board
  y: number; // 0-2 within local board
  value: CellValue;
}

export interface LocalBoard {
  id: number; // 0-8
  cells: Cell[][]; // 3x3 grid
  winner: PlayerSymbol | 'DRAW' | null;
}

export interface Move {
  playerId: string;
  boardIndex: number; // 0-8 (which local board)
  cellX: number; // 0-2
  cellY: number; // 0-2
  timestamp: Date;
}

export type MatchStatus = 'WAITING' | 'PLAYING' | 'FINISHED';

export interface GameState {
  matchId: string;
  globalBoard: (PlayerSymbol | 'DRAW' | null)[]; // 3x3 status of each local board
  localBoards: LocalBoard[]; // 9 local boards
  nextTargetBoard: number | null; // index (0-8) or null if "Free Move"
  activePlayer: PlayerSymbol;
  status: MatchStatus;
  winner: PlayerSymbol | 'DRAW' | null;
  history: Move[];
}

export interface IBotStrategy {
  name: string;
  calculateMove(
    gameState: GameState,
    botSymbol: PlayerSymbol,
  ): Promise<{ boardIndex: number; cellX: number; cellY: number }>;
}
