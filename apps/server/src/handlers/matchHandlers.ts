import { Server, Socket } from 'socket.io';
import { MatchManager } from '../managers/MatchManager.js';
import { BotManager } from '../managers/BotManager.js';
import { isValidMove, applyMove, Player, Move, PlayerSymbol } from 'shared';

export function registerMatchHandlers(
  io: Server,
  socket: Socket,
  matchManager: MatchManager,
  botManager: BotManager,
) {
  socket.on('join_match', ({ matchId, player }: { matchId: string; player: Player }) => {
    const assignedSymbol = matchManager.joinMatch(matchId, player);

    if (assignedSymbol) {
      socket.join(matchId);
      const state = matchManager.getMatch(matchId);
      const players = matchManager.getPlayers(matchId);

      if (state) {
        // Explicitly tell THIS client which symbol they were assigned
        socket.emit('player_assigned', { symbol: assignedSymbol });

        // Notify everyone in the room about the new state
        io.to(matchId).emit('game_update', state);

        if (players.length === 2) {
          io.to(matchId).emit('match_ready', { players });
        }

        // Trigger bot if it's bot's turn (e.g. if bot was assigned 'X' or after joining)
        botManager.handleStateUpdate(matchId, state, io, matchManager);
      }
    } else {
      socket.emit('error', { code: 'JOIN_FAILED', message: 'Could not join match' });
    }
  });

  socket.on(
    'make_move',
    ({
      matchId,
      move,
      playerSymbol,
    }: {
      matchId: string;
      move: Move;
      playerSymbol: PlayerSymbol;
    }) => {
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

      // After human move, check if bot should move
      botManager.handleStateUpdate(matchId, newState, io, matchManager);
    },
  );

  socket.on('disconnect', () => {
    // Basic cleanup: find matches this socket was in
    // In a real app, we'd map socket.id to matchId/playerId
    console.log(`User ${socket.id} disconnected`);
  });
}
