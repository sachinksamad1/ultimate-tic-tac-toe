import { GameState, Move, PlayerSymbol, isValidMove, applyMove } from 'shared';

export interface BotAI {
  calculateMove(state: GameState, botSymbol: PlayerSymbol): Promise<Move>;
}

/**
 * Helper to get all valid moves for a given state and player.
 */
export function getValidMoves(state: GameState, playerSymbol: PlayerSymbol): Move[] {
  const moves: Move[] = [];
  const targetBoardIndex = state.nextTargetBoard;

  if (targetBoardIndex !== null) {
    // Only search in the specific local board
    addMovesForBoard(state, playerSymbol, targetBoardIndex, moves);
  } else {
    // Free move: check all boards that are not won/drawn
    for (let i = 0; i < 9; i++) {
      if (state.localBoards[i].winner === null) {
        addMovesForBoard(state, playerSymbol, i, moves);
      }
    }
  }

  return moves;
}

function addMovesForBoard(state: GameState, playerSymbol: PlayerSymbol, boardIndex: number, moves: Move[]) {
  const board = state.localBoards[boardIndex];
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (board.cells[y][x].value === null) {
        moves.push({
          playerId: 'bot',
          boardIndex,
          cellX: x,
          cellY: y,
          timestamp: new Date()
        });
      }
    }
  }
}

export class EasyBot implements BotAI {
  async calculateMove(state: GameState, botSymbol: PlayerSymbol): Promise<Move> {
    const validMoves = getValidMoves(state, botSymbol);
    if (validMoves.length === 0) {
      throw new Error('No valid moves available for bot');
    }
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  }
}

export class HardBot implements BotAI {
  private maxDepth: number;

  constructor(maxDepth: number = 4) {
    this.maxDepth = maxDepth;
  }

  async calculateMove(state: GameState, botSymbol: PlayerSymbol): Promise<Move> {
    const validMoves = getValidMoves(state, botSymbol);
    if (validMoves.length === 0) {
      throw new Error('No valid moves available for bot');
    }

    let bestMove = validMoves[0];
    let bestValue = -Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    for (const move of validMoves) {
      const nextState = applyMove(state, move);
      const value = this.minimax(nextState, this.maxDepth - 1, alpha, beta, false, botSymbol);
      
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
      alpha = Math.max(alpha, value);
    }

    return bestMove;
  }

  private minimax(
    state: GameState,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    botSymbol: PlayerSymbol
  ): number {
    // Terminal states
    if (state.status === 'FINISHED') {
      if (state.winner === botSymbol) return 10000 + depth;
      if (state.winner === 'DRAW') return 0;
      return -10000 - depth;
    }

    if (depth === 0) {
      return this.evaluate(state, botSymbol);
    }

    const playerSymbol = isMaximizing ? botSymbol : (botSymbol === 'X' ? 'O' : 'X');
    const validMoves = getValidMoves(state, playerSymbol);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of validMoves) {
        const nextState = applyMove(state, move);
        const evalValue = this.minimax(nextState, depth - 1, alpha, beta, false, botSymbol);
        maxEval = Math.max(maxEval, evalValue);
        alpha = Math.max(alpha, evalValue);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of validMoves) {
        const nextState = applyMove(state, move);
        const evalValue = this.minimax(nextState, depth - 1, alpha, beta, true, botSymbol);
        minEval = Math.min(minEval, evalValue);
        beta = Math.min(beta, evalValue);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  private evaluate(state: GameState, botSymbol: PlayerSymbol): number {
    let score = 0;
    const opponentSymbol = botSymbol === 'X' ? 'O' : 'X';

    // 1. Global board control
    for (let i = 0; i < 9; i++) {
      const winner = state.globalBoard[i];
      const weight = (i === 4) ? 200 : 150; // Center is more valuable
      if (winner === botSymbol) score += weight;
      else if (winner === opponentSymbol) score -= weight;
    }

    // 2. Local board potential (approximate)
    for (let i = 0; i < 9; i++) {
      if (state.globalBoard[i] === null) {
        score += this.evaluateLocalBoard(state.localBoards[i], botSymbol, opponentSymbol);
      }
    }

    return score;
  }

  private evaluateLocalBoard(board: any, botSymbol: PlayerSymbol, opponentSymbol: PlayerSymbol): number {
    let localScore = 0;
    const cells = board.cells;

    // Weights for 2-in-a-row and center
    const TWO_WEIGHT = 10;
    const CENTER_WEIGHT = 5;

    // Center cell
    if (cells[1][1].value === botSymbol) localScore += CENTER_WEIGHT;
    else if (cells[1][1].value === opponentSymbol) localScore -= CENTER_WEIGHT;

    // Helper for lines
    const evaluateLine = (line: any[]) => {
      let botCount = 0;
      let oppCount = 0;
      for (const cell of line) {
        if (cell.value === botSymbol) botCount++;
        else if (cell.value === opponentSymbol) oppCount++;
      }
      if (botCount === 2 && oppCount === 0) return TWO_WEIGHT;
      if (oppCount === 2 && botCount === 0) return -TWO_WEIGHT;
      return 0;
    };

    // Rows, Columns, Diagonals
    for (let i = 0; i < 3; i++) {
      localScore += evaluateLine([cells[i][0], cells[i][1], cells[i][2]]);
      localScore += evaluateLine([cells[0][i], cells[1][i], cells[2][i]]);
    }
    localScore += evaluateLine([cells[0][0], cells[1][1], cells[2][2]]);
    localScore += evaluateLine([cells[0][2], cells[1][1], cells[2][0]]);

    return localScore;
  }
}

export class MediumBot extends HardBot {
  constructor() {
    super(2); // Depth 2: blocks immediate threats and takes immediate wins
  }
}
