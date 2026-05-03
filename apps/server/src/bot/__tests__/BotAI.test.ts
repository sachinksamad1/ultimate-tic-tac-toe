import { describe, it, expect } from 'vitest';
import { EasyBot, HardBot, getValidMoves } from '../BotAI.js';
import { createEmptyGameState } from 'shared';

describe('BotAI', () => {
  describe('getValidMoves', () => {
    it('returns 81 moves for a new game', () => {
      const state = createEmptyGameState();
      state.status = 'PLAYING';
      const moves = getValidMoves(state, 'X');
      expect(moves).toHaveLength(81);
    });

    it('returns only moves for the target board', () => {
      const state = createEmptyGameState();
      state.status = 'PLAYING';
      state.nextTargetBoard = 4; // Middle board
      const moves = getValidMoves(state, 'X');
      expect(moves).toHaveLength(9);
      expect(moves.every(m => m.boardIndex === 4)).toBe(true);
    });

    it('returns moves for all boards if nextTargetBoard is null (Free Move)', () => {
      const state = createEmptyGameState();
      state.status = 'PLAYING';
      state.nextTargetBoard = null;
      state.localBoards[0].winner = 'X'; // Board 0 won
      const moves = getValidMoves(state, 'O');
      // 9 boards * 9 cells - 9 cells from board 0 = 72 moves
      expect(moves).toHaveLength(72);
      expect(moves.some(m => m.boardIndex === 0)).toBe(false);
    });
  });

  describe('EasyBot', () => {
    it('picks a random valid move', async () => {
      const bot = new EasyBot();
      const state = createEmptyGameState();
      state.status = 'PLAYING';
      const move = await bot.calculateMove(state, 'X');
      expect(move).toBeDefined();
      expect(move.boardIndex).toBeGreaterThanOrEqual(0);
      expect(move.boardIndex).toBeLessThanOrEqual(8);
    });
  });

  describe('HardBot', () => {
    it('takes a winning move if available', async () => {
      const bot = new HardBot(1); // Depth 1: evaluate immediately after move
      const state = createEmptyGameState();
      state.status = 'PLAYING';
      
      // Setup state where X is one move away from winning board 0
      state.localBoards[0].cells[0][0].value = 'X';
      state.localBoards[0].cells[0][1].value = 'X';
      state.nextTargetBoard = 0;

      const move = await bot.calculateMove(state, 'X');
      expect(move.boardIndex).toBe(0);
      expect(move.cellX).toBe(2);
      expect(move.cellY).toBe(0);
    });

    it('blocks an opponent winning move', async () => {
      const bot = new HardBot(2); // Depth 2: see opponent's next move
      const state = createEmptyGameState();
      state.status = 'PLAYING';
      state.activePlayer = 'O';

      // Setup state where X is one move away from winning board 4
      state.localBoards[4].cells[1][0].value = 'X';
      state.localBoards[4].cells[1][1].value = 'X';
      state.nextTargetBoard = 4;

      const move = await bot.calculateMove(state, 'O');
      expect(move.boardIndex).toBe(4);
      expect(move.cellX).toBe(2);
      expect(move.cellY).toBe(1);
    });
  });
});
