import { Server, Socket } from 'socket.io';
import { MatchManager } from '../managers/MatchManager.js';
import { isValidMove, applyMove, Player, Move } from 'shared';

export function registerMatchHandlers(io: Server, socket: Socket, matchManager: MatchManager) {
  
  socket.on('join_match', ({ matchId, player }: { matchId: string, player: Player }) => {
    const success = matchManager.joinMatch(matchId, player);
    
    if (success) {
      socket.join(matchId);
      const state = matchManager.getMatch(matchId);
      const players = matchManager.getPlayers(matchId);
      
      // Notify everyone in the room about the new state
      io.to(matchId).emit('game_update', state);
      
      if (players.length === 2) {
        io.to(matchId).emit('match_ready', { players });
      }
    } else {
      socket.emit('error', { code: 'JOIN_FAILED', message: 'Could not join match' });
    }
  });

  socket.on('make_move', ({ matchId, move, playerSymbol }: { matchId: string, move: Move, playerSymbol: any }) => {
    const state = matchManager.getMatch(matchId);
    
    if (!state) {
      socket.emit('error', { code: 'MATCH_NOT_FOUND', message: 'Match not found' });
      return;
    }

    if (!isValidMove(state, move, playerSymbol)) {
      socket.emit('error', { code: 'INVALID_MOVE', message: 'Move is not valid' });
      return;
    }

    const newState = applyMove(state, move);
    matchManager.updateMatch(matchId, newState);
    
    io.to(matchId).emit('game_update', newState);
  });

  socket.on('disconnect', () => {
    // Basic cleanup: find matches this socket was in
    // In a real app, we'd map socket.id to matchId/playerId
    console.log(`User ${socket.id} disconnected`);
  });
}
