import { GameState, Move } from '../types/index.js';
import { checkLocalWin, checkGlobalWin } from './winConditions.js';

/**
 * Applies a move to the game state and returns the new state.
 * Assumes the move has already been validated.
 */
export function applyMove(state: GameState, move: Move): GameState {
  // 1. Deep clone state (simple JSON clone for brevity, but could be more efficient)
  const newState: GameState = JSON.parse(JSON.stringify(state));
  const activeSymbol = newState.activePlayer;

  // 2. Update cell
  const localBoard = newState.localBoards[move.boardIndex];
  localBoard.cells[move.cellY][move.cellX].value = activeSymbol;

  // 3. Update local board status
  const localWinner = checkLocalWin(localBoard.cells.map((row) => row.map((c) => c.value)));
  if (localWinner) {
    localBoard.winner = localWinner;
    newState.globalBoard[move.boardIndex] = localWinner;
  }

  // 4. Update global board status
  const globalWinner = checkGlobalWin(newState.globalBoard);
  if (globalWinner) {
    newState.winner = globalWinner === 'DRAW' ? 'DRAW' : globalWinner;
    newState.status = 'FINISHED';
  }

  // 5. Determine next target board
  // The next local board index is determined by the cell coordinates (3*y + x)
  const nextIdx = move.cellY * 3 + move.cellX;
  const nextTargetBoard = newState.localBoards[nextIdx];

  // If the next target board is already won or full, it's a "Free Move"
  if (nextTargetBoard.winner !== null) {
    newState.nextTargetBoard = null;
  } else {
    newState.nextTargetBoard = nextIdx;
  }

  // 6. Switch active player
  newState.activePlayer = activeSymbol === 'X' ? 'O' : 'X';

  // 7. Record history
  newState.history.push({ ...move, timestamp: new Date() });

  return newState;
}
