import { describe, it, expect, beforeEach } from 'vitest';
import { MatchManager } from '../MatchManager.js';
import { Player } from 'shared';

describe('MatchManager', () => {
  let manager: MatchManager;

  beforeEach(() => {
    manager = new MatchManager();
  });

  it('creates a new match with unique ID', () => {
    const state1 = manager.createMatch();
    const state2 = manager.createMatch();
    expect(state1.matchId).toBeDefined();
    expect(state2.matchId).toBeDefined();
    expect(state1.matchId).not.toBe(state2.matchId);
  });

  it('allows players to join a match and assigns symbols', () => {
    const state = manager.createMatch();
    const player1: Player = { id: '1', username: 'alice', symbol: 'X' };
    const player2: Player = { id: '2', username: 'bob', symbol: 'O' };

    expect(manager.joinMatch(state.matchId, player1)).toBe('X');
    expect(manager.joinMatch(state.matchId, player2)).toBe('O');
    expect(manager.getPlayers(state.matchId)).toHaveLength(2);
  });

  it('sets game status to PLAYING when two players join', () => {
    const state = manager.createMatch();
    const player1: Player = { id: '1', username: 'alice', symbol: 'X' };
    const player2: Player = { id: '2', username: 'bob', symbol: 'O' };

    manager.joinMatch(state.matchId, player1);
    expect(manager.getMatch(state.matchId)?.status).toBe('WAITING');
    
    manager.joinMatch(state.matchId, player2);
    expect(manager.getMatch(state.matchId)?.status).toBe('PLAYING');
  });

  it('rejects joining if match is full', () => {
    const state = manager.createMatch();
    manager.joinMatch(state.matchId, { id: '1', username: 'a', symbol: 'X' });
    manager.joinMatch(state.matchId, { id: '2', username: 'b', symbol: 'O' });
    
    expect(manager.joinMatch(state.matchId, { id: '3', username: 'c', symbol: 'X' })).toBe(null);
  });

  it('respects preferred symbol if available', () => {
    const state = manager.createMatch();
    const player1: Player = { id: '1', username: 'alice', symbol: 'O' }; // Alice wants O
    const player2: Player = { id: '2', username: 'bob', symbol: 'X' }; // Bob wants X

    expect(manager.joinMatch(state.matchId, player1)).toBe('O');
    expect(manager.joinMatch(state.matchId, player2)).toBe('X');
  });

  it('assigns alternative symbol if preference is taken', () => {
    const state = manager.createMatch();
    const player1: Player = { id: '1', username: 'alice', symbol: 'X' };
    const player2: Player = { id: '2', username: 'bob', symbol: 'X' }; // Bob also wants X

    expect(manager.joinMatch(state.matchId, player1)).toBe('X');
    expect(manager.joinMatch(state.matchId, player2)).toBe('O'); // Bob gets O
  });
});
