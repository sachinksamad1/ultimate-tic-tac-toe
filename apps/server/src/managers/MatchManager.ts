import { GameState, createEmptyGameState, Player } from 'shared';
import { v4 as uuidv4 } from 'uuid';

export class MatchManager {
  private matches: Map<string, GameState> = new Map();
  private players: Map<string, Player[]> = new Map(); // matchId -> players

  createMatch(): GameState {
    const matchId = uuidv4();
    const state = createEmptyGameState(matchId);
    this.matches.set(matchId, state);
    this.players.set(matchId, []);
    return state;
  }

  getMatch(matchId: string): GameState | undefined {
    return this.matches.get(matchId);
  }

  joinMatch(matchId: string, player: Player): PlayerSymbol | null {
    const currentPlayers = this.players.get(matchId);
    if (!currentPlayers || currentPlayers.length >= 2) {
      return null;
    }
    
    // Check if player is already in match
    const existingPlayer = currentPlayers.find(p => p.id === player.id);
    if (existingPlayer) {
      return existingPlayer.symbol; 
    }

    const takenSymbols = currentPlayers.map(p => p.symbol);
    
    if (player.symbol && (player.symbol === 'X' || player.symbol === 'O') && !takenSymbols.includes(player.symbol)) {
      // Keep preferred symbol if available
    } else {
      // Assign available symbol
      player.symbol = takenSymbols.includes('X') ? 'O' : 'X';
    }

    currentPlayers.push(player);
    
    // If it's the second player, start the game
    if (currentPlayers.length === 2) {
      const state = this.matches.get(matchId);
      if (state) {
        state.status = 'PLAYING';
      }
    }
    
    return player.symbol;
  }

  getPlayers(matchId: string): Player[] {
    return this.players.get(matchId) || [];
  }

  updateMatch(matchId: string, newState: GameState): void {
    if (this.matches.has(matchId)) {
      this.matches.set(matchId, newState);
    }
  }

  removeMatch(matchId: string): void {
    this.matches.delete(matchId);
    this.players.delete(matchId);
  }
}
