import type { GameState, Move, PlayerSymbol } from '../types/index.js';

/**
 * Validates if a move is legal according to the Ultimate Tic-Tac-Toe rules.
 */
export function isValidMove(state: GameState, move: Move, playerSymbol: PlayerSymbol): boolean {
  // 1. Check if game is active
  if (state.status !== 'PLAYING') return false;

  // 2. Check if it's the player's turn
  if (playerSymbol !== state.activePlayer) return false;

  // 3. Check board bounds
  if (move.boardIndex < 0 || move.boardIndex > 8) return false;
  if (move.cellX < 0 || move.cellX > 2 || move.cellY < 0 || move.cellY > 2) return false;

  // 4. Check if the target local board is the one required by the previous move (the "Ultimate" rule)
  if (state.nextTargetBoard !== null && move.boardIndex !== state.nextTargetBoard) {
    return false;
  }

  // 5. Check if the target local board is already resolved (won or draw)
  // Even if it's a free move, you can't play in a finished board.
  const targetBoard = state.localBoards[move.boardIndex];
  if (targetBoard.winner !== null) return false;

  // 6. Check if the specific cell is already occupied
  const cell = targetBoard.cells[move.cellY][move.cellX];
  if (cell.value !== null) return false;

  return true;
}
