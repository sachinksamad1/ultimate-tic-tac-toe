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

  joinMatch(matchId: string, player: Player): boolean {
    const currentPlayers = this.players.get(matchId);
    if (!currentPlayers || currentPlayers.length >= 2) {
      return false;
    }
    
    // Check if player is already in match
    if (currentPlayers.some(p => p.id === player.id)) {
      return true; 
    }

    currentPlayers.push(player);
    
    // If it's the second player, start the game
    if (currentPlayers.length === 2) {
      const state = this.matches.get(matchId);
      if (state) {
        state.status = 'PLAYING';
      }
    }
    
    return true;
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
