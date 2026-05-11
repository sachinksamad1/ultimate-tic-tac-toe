import { describe, it, expect } from 'vitest';
import { applyMove } from '../transitions.js';
import { createEmptyGameState } from '../factories.js';
import { Move } from '../../types/index.js';

describe('transitions', () => {
  const move: Move = {
    playerId: 'p1',
    boardIndex: 0,
    cellX: 0,
    cellY: 0,
    timestamp: new Date(),
  };

  it('updates cell value and switches player', () => {
    const state = createEmptyGameState();
    const newState = applyMove(state, move);

    expect(newState.localBoards[0].cells[0][0].value).toBe('X');
    expect(newState.activePlayer).toBe('O');
  });

  it('calculates nextTargetBoard correctly', () => {
    const state = createEmptyGameState();
    // Move in local board 0 at cell (1, 1) -> next target board should be 4
    const midMove = { ...move, cellX: 1, cellY: 1 };
    const newState = applyMove(state, midMove);

    expect(newState.nextTargetBoard).toBe(4);
  });

  it('marks local board as won', () => {
    const state = createEmptyGameState();
    // Setup 2 in a row
    state.localBoards[0].cells[0][0].value = 'X';
    state.localBoards[0].cells[0][1].value = 'X';

    // Winning move
    const winningMove = { ...move, cellX: 2, cellY: 0 };
    const newState = applyMove(state, winningMove);

    expect(newState.localBoards[0].winner).toBe('X');
    expect(newState.globalBoard[0]).toBe('X');
  });

  it('handles free move when target board is won', () => {
    const state = createEmptyGameState();
    // Target board 4 is already won
    state.localBoards[4].winner = 'O';

    // Move that would normally target board 4 (cell 1,1)
    const midMove = { ...move, cellX: 1, cellY: 1 };
    const newState = applyMove(state, midMove);

    expect(newState.nextTargetBoard).toBe(null);
  });

  it('detects global winner', () => {
    const state = createEmptyGameState();
    // Setup 2 local boards won
    state.globalBoard[0] = 'X';
    state.globalBoard[1] = 'X';

    // Winning move for local board 2
    state.localBoards[2].cells[0][0].value = 'X';
    state.localBoards[2].cells[0][1].value = 'X';

    const winningMove = { ...move, boardIndex: 2, cellX: 2, cellY: 0 };
    const newState = applyMove(state, winningMove);

    expect(newState.winner).toBe('X');
    expect(newState.status).toBe('FINISHED');
  });
});
