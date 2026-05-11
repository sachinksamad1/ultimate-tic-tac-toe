import { describe, it, expect } from 'vitest';
import { isValidMove } from '../validation.js';
import { createEmptyGameState } from '../factories.js';
import { Move } from '../../types/index.js';

describe('validation', () => {
  const move: Move = {
    playerId: 'p1',
    boardIndex: 0,
    cellX: 0,
    cellY: 0,
    timestamp: new Date(),
  };

  it('accepts move in empty board with no target constraint', () => {
    const state = createEmptyGameState();
    state.status = 'PLAYING';
    expect(isValidMove(state, move, 'X')).toBe(true);
  });

  it('rejects move when not player turn', () => {
    const state = createEmptyGameState();
    state.status = 'PLAYING';
    state.activePlayer = 'O';
    expect(isValidMove(state, move, 'X')).toBe(false);
  });

  it('rejects move when game is not active', () => {
    const state = createEmptyGameState();
    state.status = 'FINISHED';
    expect(isValidMove(state, move, 'X')).toBe(false);
  });

  it('rejects move when target board is incorrect', () => {
    const state = createEmptyGameState();
    state.status = 'PLAYING';
    state.nextTargetBoard = 4;
    expect(isValidMove(state, move, 'X')).toBe(false);
  });

  it('accepts move when target board is correct', () => {
    const state = createEmptyGameState();
    state.status = 'PLAYING';
    state.nextTargetBoard = 0;
    expect(isValidMove(state, move, 'X')).toBe(true);
  });

  it('rejects move in occupied cell', () => {
    const state = createEmptyGameState();
    state.status = 'PLAYING';
    state.localBoards[0].cells[0][0].value = 'O';
    expect(isValidMove(state, move, 'X')).toBe(false);
  });

  it('rejects move in won local board', () => {
    const state = createEmptyGameState();
    state.status = 'PLAYING';
    state.localBoards[0].winner = 'O';
    expect(isValidMove(state, move, 'X')).toBe(false);
  });

  it('accepts free move in any open board', () => {
    const state = createEmptyGameState();
    state.status = 'PLAYING';
    state.nextTargetBoard = null;
    const anotherMove = { ...move, boardIndex: 8 };
    expect(isValidMove(state, anotherMove, 'X')).toBe(true);
  });
});
