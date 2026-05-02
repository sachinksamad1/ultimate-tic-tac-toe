import { describe, it, expect } from 'vitest';
import { checkLineWin, checkLocalWin, checkGlobalWin } from '../winConditions.js';
import { PlayerSymbol } from '../../types/index.js';

describe('winConditions', () => {
  describe('checkLineWin', () => {
    it('detects horizontal win', () => {
      expect(checkLineWin(['X', 'X', 'X'])).toBe('X');
      expect(checkLineWin(['O', 'O', 'O'])).toBe('O');
    });

    it('returns null for incomplete line', () => {
      expect(checkLineWin(['X', 'X', null])).toBe(null);
      expect(checkLineWin([null, null, null])).toBe(null);
    });

    it('returns null for mixed symbols', () => {
      expect(checkLineWin(['X', 'O', 'X'])).toBe(null);
    });
  });

  describe('checkLocalWin', () => {
    it('detects row win', () => {
      const cells = [
        ['X', 'X', 'X'],
        [null, 'O', null],
        [null, null, 'O']
      ] as any;
      expect(checkLocalWin(cells)).toBe('X');
    });

    it('detects column win', () => {
      const cells = [
        ['O', 'X', null],
        ['O', null, 'X'],
        ['O', null, null]
      ] as any;
      expect(checkLocalWin(cells)).toBe('O');
    });

    it('detects diagonal win', () => {
      const cells = [
        ['X', null, null],
        [null, 'X', null],
        [null, null, 'X']
      ] as any;
      expect(checkLocalWin(cells)).toBe('X');
    });

    it('detects draw', () => {
      const cells = [
        ['X', 'O', 'X'],
        ['X', 'O', 'O'],
        ['O', 'X', 'X']
      ] as any;
      expect(checkLocalWin(cells)).toBe('DRAW');
    });

    it('returns null for in-progress board', () => {
      const cells = [
        ['X', 'O', null],
        [null, null, null],
        [null, null, null]
      ] as any;
      expect(checkLocalWin(cells)).toBe(null);
    });
  });

  describe('checkGlobalWin', () => {
    it('detects global win across local board winners', () => {
      const globalBoard: (PlayerSymbol | 'DRAW' | null)[] = [
        'X', 'X', 'X',
        'O', null, null,
        null, 'O', null
      ];
      expect(checkGlobalWin(globalBoard)).toBe('X');
    });

    it('ignores DRAWs for winning lines', () => {
      const globalBoard: (PlayerSymbol | 'DRAW' | null)[] = [
        'X', 'DRAW', 'X',
        null, null, null,
        null, null, null
      ];
      expect(checkGlobalWin(globalBoard)).toBe(null);
    });

    it('detects global draw when all boards resolved', () => {
      const globalBoard: (PlayerSymbol | 'DRAW' | null)[] = [
        'X', 'O', 'X',
        'X', 'O', 'O',
        'O', 'X', 'DRAW'
      ];
      expect(checkGlobalWin(globalBoard)).toBe('DRAW');
    });
  });
});
