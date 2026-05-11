import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as ioc } from 'socket.io-client';
import express from 'express';
import { MatchManager } from '../managers/MatchManager.js';
import { BotManager } from '../managers/BotManager.js';
import { registerMatchHandlers } from '../handlers/matchHandlers.js';
import { AddressInfo } from 'net';

describe('Integration Tests', () => {
  let io: Server;
  let server: any;
  let matchManager: MatchManager;
  let botManager: BotManager;
  let port: number;

  beforeAll(async () => {
    const app = express();
    server = createServer(app);
    io = new Server(server);
    matchManager = new MatchManager();
    botManager = new BotManager();

    io.on('connection', (socket) => {
      registerMatchHandlers(io, socket, matchManager, botManager);
    });

    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        port = (server.address() as AddressInfo).port;
        resolve();
      });
    });
  });

  afterAll(() => {
    io.close();
    server.close();
  });

  it('allows two players to join and start a match', async () => {
    const match = matchManager.createMatch();
    const matchId = match.matchId;

    const client1 = ioc(`http://localhost:${port}`);
    const client2 = ioc(`http://localhost:${port}`);

    const player1 = { id: '1', username: 'p1', symbol: 'X' };
    const player2 = { id: '2', username: 'p2', symbol: 'O' };

    await new Promise<void>((resolve) => {
      let readyCount = 0;
      const checkReady = () => {
        readyCount++;
        if (readyCount === 2) resolve();
      };

      client1.on('match_ready', checkReady);
      client2.on('match_ready', checkReady);

      client1.emit('join_match', { matchId, player: player1 });
      client2.emit('join_match', { matchId, player: player2 });
    });

    client1.disconnect();
    client2.disconnect();
  });

  it('broadcasts game updates after a move', async () => {
    const match = matchManager.createMatch();
    const matchId = match.matchId;

    const client1 = ioc(`http://localhost:${port}`);
    const client2 = ioc(`http://localhost:${port}`);

    const player1 = { id: '1', username: 'p1', symbol: 'X' };
    const player2 = { id: '2', username: 'p2', symbol: 'O' };

    // Join both
    await new Promise<void>((resolve) => {
      client2.on('match_ready', () => resolve());
      client1.emit('join_match', { matchId, player: player1 });
      client2.emit('join_match', { matchId, player: player2 });
    });

    // Make a move
    const move = { playerId: '1', boardIndex: 0, cellX: 1, cellY: 1, timestamp: new Date() };

    await new Promise<void>((resolve) => {
      client2.on('game_update', (state: any) => {
        if (state.localBoards[0].cells[1][1].value === 'X') {
          resolve();
        }
      });
      client1.emit('make_move', { matchId, move, playerSymbol: 'X' });
    });

    client1.disconnect();
    client2.disconnect();
  });

  it('triggers bot response after player move', async () => {
    // Create bot match
    const state = matchManager.createMatch();
    const matchId = state.matchId;
    const { EasyBot } = await import('../bot/BotAI.js');
    botManager.registerBot(matchId, new EasyBot(), 'O');
    matchManager.joinMatch(matchId, { id: 'bot', username: 'Bot', symbol: 'O' });

    const client = ioc(`http://localhost:${port}`);
    const player = { id: '1', username: 'human', symbol: 'X' };

    await new Promise<void>((resolve) => {
      client.emit('join_match', { matchId, player });
      client.on('game_update', (s: any) => {
        if (s.status === 'PLAYING') resolve();
      });
    });

    // Make human move
    const move = { playerId: '1', boardIndex: 4, cellX: 1, cellY: 1, timestamp: new Date() };

    await new Promise<void>((resolve) => {
      let updates = 0;
      client.on('game_update', (newState: any) => {
        updates++;
        // First update is human move, second should be bot move
        if (newState.activePlayer === 'X' && newState.history.length === 2) {
          resolve();
        }
      });
      client.emit('make_move', { matchId, move, playerSymbol: 'X' });
    });

    client.disconnect();
  });
});
