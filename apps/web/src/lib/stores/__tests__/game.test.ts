import { describe, it, expect, beforeEach } from 'vitest';
import { gameStore, mySymbol, isMyTurn, activeBoardIndex } from '../game.js';
import { get } from 'svelte/store';
import { createEmptyGameState } from 'shared';

describe('gameStore', () => {
  beforeEach(() => {
    gameStore.reset();
    mySymbol.set(null);
  });

  it('initializes with null', () => {
    expect(get(gameStore)).toBeNull();
  });

  it('updates state correctly', () => {
    const state = createEmptyGameState();
    gameStore.setState(state);
    expect(get(gameStore)).toEqual(state);
  });

  it('derives isMyTurn correctly', () => {
    const state = createEmptyGameState();
    state.activePlayer = 'X';
    state.status = 'PLAYING';

    gameStore.setState(state);

    mySymbol.set('X');
    expect(get(isMyTurn)).toBe(true);

    mySymbol.set('O');
    expect(get(isMyTurn)).toBe(false);
  });

  it('derives activeBoardIndex correctly', () => {
    const state = createEmptyGameState();
    state.nextTargetBoard = 5;
    gameStore.setState(state);
    expect(get(activeBoardIndex)).toBe(5);
  });
});
