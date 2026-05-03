import { Server } from 'socket.io';
import { GameState, PlayerSymbol, applyMove } from 'shared';
import { MatchManager } from './MatchManager.js';
import { BotAI } from '../bot/BotAI.js';

export class BotManager {
  private bots: Map<string, { ai: BotAI; symbol: PlayerSymbol }> = new Map();

  /**
   * Registers a bot for a specific match.
   */
  registerBot(matchId: string, ai: BotAI, symbol: PlayerSymbol) {
    this.bots.set(matchId, { ai, symbol });
  }

  /**
   * Removes a bot registration.
   */
  removeBot(matchId: string) {
    this.bots.delete(matchId);
  }

  /**
   * Checks if it's the bot's turn and executes a move if so.
   */
  async handleStateUpdate(
    matchId: string,
    state: GameState,
    io: Server,
    matchManager: MatchManager
  ) {
    const botConfig = this.bots.get(matchId);
    if (!botConfig) return;

    if (state.status === 'PLAYING' && state.activePlayer === botConfig.symbol) {
      // Simulate "thinking" time
      setTimeout(async () => {
        try {
          const latestState = matchManager.getMatch(matchId);
          if (!latestState || latestState.status !== 'PLAYING' || latestState.activePlayer !== botConfig.symbol) {
            return;
          }

          const move = await botConfig.ai.calculateMove(latestState, botConfig.symbol);
          
          const newState = applyMove(latestState, move);
          matchManager.updateMatch(matchId, newState);
          
          io.to(matchId).emit('game_update', newState);

          // Recursively call in case of multi-move rules (not used here but good practice)
          this.handleStateUpdate(matchId, newState, io, matchManager);
        } catch (e) {
          console.error(`[BotManager] Error in match ${matchId}:`, e);
        }
      }, 800 + Math.random() * 700); // 800ms - 1500ms delay
    } else if (state.status === 'FINISHED') {
      // Cleanup bot after game is over
      this.removeBot(matchId);
    }
  }
}
