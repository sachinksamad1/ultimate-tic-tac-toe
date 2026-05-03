import type { PlayerSymbol, CellValue, LocalBoard } from '../types/index.js';

/**
 * Checks if a 3-element line is won by a single player.
 */
export function checkLineWin(line: CellValue[]): PlayerSymbol | null {
  if (line.length !== 3) return null;
  const first = line[0];
  if (first && line.every(cell => cell === first)) {
    return first;
  }
  return null;
}

/**
 * Evaluates a 3x3 grid for a winner or a draw.
 */
export function checkLocalWin(cells: CellValue[][]): PlayerSymbol | 'DRAW' | null {
  const size = 3;

  // Rows
  for (let i = 0; i < size; i++) {
    const winner = checkLineWin(cells[i]);
    if (winner) return winner;
  }

  // Columns
  for (let i = 0; i < size; i++) {
    const winner = checkLineWin([cells[0][i], cells[1][i], cells[2][i]]);
    if (winner) return winner;
  }

  // Diagonals
  const d1 = checkLineWin([cells[0][0], cells[1][1], cells[2][2]]);
  if (d1) return d1;

  const d2 = checkLineWin([cells[0][2], cells[1][1], cells[2][0]]);
  if (d2) return d2;

  // Check for Draw (all cells filled)
  const isFull = cells.every(row => row.every(cell => cell !== null));
  if (isFull) return 'DRAW';

  return null;
}

/**
 * Evaluates the overall 9x9 game state based on winners of local boards.
 */
export function checkGlobalWin(globalBoard: (PlayerSymbol | 'DRAW' | null)[]): PlayerSymbol | 'DRAW' | null {
  // Convert flat 9-element array to 3x3 for convenience
  const grid: (PlayerSymbol | 'DRAW' | null)[][] = [
    [globalBoard[0], globalBoard[1], globalBoard[2]],
    [globalBoard[3], globalBoard[4], globalBoard[5]],
    [globalBoard[6], globalBoard[7], globalBoard[8]]
  ];

  // Map DRAW to null for line win checks (DRAWs don't count towards winning a line)
  const mapSymbol = (s: PlayerSymbol | 'DRAW' | null): PlayerSymbol | null => 
    (s === 'DRAW' ? null : s);

  // Rows
  for (let i = 0; i < 3; i++) {
    const winner = checkLineWin(grid[i].map(mapSymbol));
    if (winner) return winner;
  }

  // Columns
  for (let i = 0; i < 3; i++) {
    const winner = checkLineWin([grid[0][i], grid[1][i], grid[2][i]].map(mapSymbol));
    if (winner) return winner;
  }

  // Diagonals
  const d1 = checkLineWin([grid[0][0], grid[1][1], grid[2][2]].map(mapSymbol));
  if (d1) return d1;

  const d2 = checkLineWin([grid[0][2], grid[1][1], grid[2][0]].map(mapSymbol));
  if (d2) return d2;

  // Check for Draw (all boards resolved)
  const allResolved = globalBoard.every(board => board !== null);
  if (allResolved) return 'DRAW';

  return null;
}
