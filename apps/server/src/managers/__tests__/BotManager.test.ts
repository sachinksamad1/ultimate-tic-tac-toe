import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BotManager } from '../BotManager.js';
import { MatchManager } from '../MatchManager.js';
import { EasyBot } from '../../bot/BotAI.js';
import { createEmptyGameState } from 'shared';

describe('BotManager', () => {
  let botManager: BotManager;
  let matchManager: MatchManager;
  let mockIo: any;

  beforeEach(() => {
    vi.useFakeTimers();
    botManager = new BotManager();
    matchManager = new MatchManager();
    mockIo = {
      to: vi.fn().mockReturnThis(),
      emit: vi.fn()
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('registers and triggers a bot move', async () => {
    const state = matchManager.createMatch();
    state.status = 'PLAYING';
    state.activePlayer = 'O'; // Bot's turn
    
    const bot = new EasyBot();
    botManager.registerBot(state.matchId, bot, 'O');

    await botManager.handleStateUpdate(state.matchId, state, mockIo, matchManager);

    // Should wait for timeout
    expect(mockIo.emit).not.toHaveBeenCalled();

    // Fast-forward time
    vi.runAllTimers();

    // Wait for the async calculation
    await vi.waitFor(() => {
      expect(mockIo.emit).toHaveBeenCalledWith('game_update', expect.any(Object));
    });

    const newState = matchManager.getMatch(state.matchId);
    expect(newState?.activePlayer).toBe('X'); // Should have switched to X
    expect(newState?.history).toHaveLength(1);
  });

  it('does not trigger if it is not the bots turn', async () => {
    const state = matchManager.createMatch();
    state.status = 'PLAYING';
    state.activePlayer = 'X'; // Human's turn
    
    const bot = new EasyBot();
    botManager.registerBot(state.matchId, bot, 'O');

    await botManager.handleStateUpdate(state.matchId, state, mockIo, matchManager);

    vi.runAllTimers();
    expect(mockIo.emit).not.toHaveBeenCalled();
  });
});
