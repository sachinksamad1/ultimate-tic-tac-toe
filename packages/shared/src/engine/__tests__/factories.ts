import { GameState, LocalBoard } from '../../types/index.js';

export function createEmptyBoard(id: number): LocalBoard {
  return {
    id,
    cells: Array(3).fill(null).map((_, y) => 
      Array(3).fill(null).map((_, x) => ({ x, y, value: null }))
    ),
    winner: null
  };
}

export function createEmptyGameState(matchId = 'test-match'): GameState {
  return {
    matchId,
    globalBoard: Array(9).fill(null),
    localBoards: Array(9).fill(null).map((_, i) => createEmptyBoard(i)),
    nextTargetBoard: null,
    activePlayer: 'X',
    status: 'PLAYING',
    winner: null,
    history: []
  };
}
