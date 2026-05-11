import { GameState, Move, PlayerSymbol, IBotStrategy, LocalBoard } from '../types/index.js';
import { applyMove } from '../engine/transitions.js';

/**
 * Helper to get all valid moves for a given state and player.
 */
export function getValidMoves(
  state: GameState,
): { boardIndex: number; cellX: number; cellY: number }[] {
  const moves: { boardIndex: number; cellX: number; cellY: number }[] = [];
  const targetBoardIndex = state.nextTargetBoard;

  if (targetBoardIndex !== null) {
    addMovesForBoard(state, targetBoardIndex, moves);
  } else {
    for (let i = 0; i < 9; i++) {
      if (state.localBoards[i].winner === null) {
        addMovesForBoard(state, i, moves);
      }
    }
  }

  return moves;
}

function addMovesForBoard(
  state: GameState,
  boardIndex: number,
  moves: { boardIndex: number; cellX: number; cellY: number }[],
) {
  const board = state.localBoards[boardIndex];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (board.cells[y][x].value === null) {
        moves.push({
          boardIndex,
          cellX: x,
          cellY: y,
        });
      }
    }
  }
}

export class EasyBotStrategy implements IBotStrategy {
  name = 'Easy';
  async calculateMove(
    state: GameState,
    _botSymbol: PlayerSymbol,
  ): Promise<{ boardIndex: number; cellX: number; cellY: number }> {
    // botSymbol is unused in Easy strategy as it just picks a random valid move
    const validMoves = getValidMoves(state);
    if (validMoves.length === 0) {
      throw new Error('No valid moves available for bot');
    }
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }
}

export class HardBotStrategy implements IBotStrategy {
  name = 'Hard';
  protected maxDepth: number;

  constructor(maxDepth: number = 4) {
    this.maxDepth = maxDepth;
  }

  async calculateMove(
    state: GameState,
    botSymbol: PlayerSymbol,
  ): Promise<{ boardIndex: number; cellX: number; cellY: number }> {
    const validMoves = getValidMoves(state);
    if (validMoves.length === 0) {
      throw new Error('No valid moves available for bot');
    }

    let bestMove = validMoves[0];
    let bestValue = -Infinity;
    let alpha = -Infinity;
    const beta = Infinity;

    for (const moveData of validMoves) {
      const move: Move = { ...moveData, playerId: 'bot', timestamp: new Date() };
      const nextState = applyMove(state, move);
      const value = this.minimax(nextState, this.maxDepth - 1, alpha, beta, false, botSymbol);

      if (value > bestValue) {
        bestValue = value;
        bestMove = moveData;
      }
      alpha = Math.max(alpha, value);
    }

    return bestMove;
  }

  protected minimax(
    state: GameState,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    botSymbol: PlayerSymbol,
  ): number {
    if (state.status === 'FINISHED') {
      if (state.winner === botSymbol) return 10000 + depth;
      if (state.winner === 'DRAW') return 0;
      return -10000 - depth;
    }

    if (depth === 0) {
      return this.evaluate(state, botSymbol);
    }

    const validMoves = getValidMoves(state);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const moveData of validMoves) {
        const move: Move = { ...moveData, playerId: 'bot', timestamp: new Date() };
        const nextState = applyMove(state, move);
        const evalValue = this.minimax(nextState, depth - 1, alpha, beta, false, botSymbol);
        maxEval = Math.max(maxEval, evalValue);
        alpha = Math.max(alpha, evalValue);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const moveData of validMoves) {
        const move: Move = { ...moveData, playerId: 'bot', timestamp: new Date() };
        const nextState = applyMove(state, move);
        const evalValue = this.minimax(nextState, depth - 1, alpha, beta, true, botSymbol);
        minEval = Math.min(minEval, evalValue);
        beta = Math.min(beta, evalValue);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  protected evaluate(state: GameState, botSymbol: PlayerSymbol): number {
    let score = 0;
    const opponentSymbol = botSymbol === 'X' ? 'O' : 'X';

    for (let i = 0; i < 9; i++) {
      const winner = state.globalBoard[i];
      const weight = i === 4 ? 200 : 150;
      if (winner === botSymbol) score += weight;
      else if (winner === opponentSymbol) score -= weight;
    }

    for (let i = 0; i < 9; i++) {
      if (state.globalBoard[i] === null) {
        score += this.evaluateLocalBoard(state.localBoards[i], botSymbol, opponentSymbol);
      }
    }

    return score;
  }

  protected evaluateLocalBoard(
    board: LocalBoard,
    botSymbol: PlayerSymbol,
    opponentSymbol: PlayerSymbol,
  ): number {
    let localScore = 0;
    const cells = board.cells;
    const TWO_WEIGHT = 10;
    const CENTER_WEIGHT = 5;

    if (cells[1][1].value === botSymbol) localScore += CENTER_WEIGHT;
    else if (cells[1][1].value === opponentSymbol) localScore -= CENTER_WEIGHT;

    const evaluateLine = (lineValues: (PlayerSymbol | null)[]) => {
      let botCount = 0;
      let oppCount = 0;
      for (const val of lineValues) {
        if (val === botSymbol) botCount++;
        else if (val === opponentSymbol) oppCount++;
      }
      if (botCount === 2 && oppCount === 0) return TWO_WEIGHT;
      if (oppCount === 2 && botCount === 0) return -TWO_WEIGHT;
      return 0;
    };

    for (let i = 0; i < 3; i++) {
      localScore += evaluateLine([cells[i][0].value, cells[i][1].value, cells[i][2].value]);
      localScore += evaluateLine([cells[0][i].value, cells[1][i].value, cells[2][i].value]);
    }
    localScore += evaluateLine([cells[0][0].value, cells[1][1].value, cells[2][2].value]);
    localScore += evaluateLine([cells[0][2].value, cells[1][1].value, cells[2][0].value]);

    return localScore;
  }
}

export class MediumBotStrategy extends HardBotStrategy {
  override name = 'Medium';
  constructor() {
    super(2);
  }
}
