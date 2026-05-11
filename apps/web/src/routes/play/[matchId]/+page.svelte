<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { socketStore } from '$lib/stores/socket';
  import { gameStore, mySymbol, isMyTurn } from '$lib/stores/game';
  import { t } from '$lib/i18n/translations';
  import GlobalBoard from '$lib/components/GlobalBoard.svelte';
  import GameOverlay from '$lib/components/GameOverlay.svelte';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
  import CreatorInfo from '$lib/components/CreatorInfo.svelte';
  import type { Move, PlayerSymbol } from 'shared';

  const matchId = $page.params.matchId;
  let error: string | null = null;
  let showCopied = false;

  // Persistent player ID for the session
  const playerId = Math.random().toString(36).substr(2, 9);

  onMount(() => {
    socketStore.connect();

    const unsubscribeSocket = socketStore.subscribe((socket: any) => {
      if (!socket) return;

      socket.on('connect', () => {
        console.log('Connected to socket');
        const player = {
          id: playerId,
          username: `Player_${Math.floor(Math.random() * 1000)}`,
          symbol: 'X' as PlayerSymbol, // Symbol is now assigned by server
        };

        socket.emit('join_match', { matchId, player });
      });

      socket.on('player_assigned', ({ symbol }: { symbol: PlayerSymbol }) => {
        console.log('Assigned symbol:', symbol);
        mySymbol.set(symbol);
      });

      socket.on('game_update', (state: any) => {
        gameStore.setState(state);
      });

      socket.on('match_ready', ({ players }: any) => {
        console.log('Match is ready!', players);
      });

      socket.on('error', (err: any) => {
        error = err.message;
        setTimeout(() => {
          error = null;
        }, 5000);
      });
    });

    return () => {
      unsubscribeSocket();
      socketStore.disconnect();
      gameStore.reset();
    };
  });

  function handleMove(boardIndex: number, cellX: number, cellY: number) {
    if (!$isMyTurn || !$gameStore) return;

    const move: Move = {
      playerId,
      boardIndex,
      cellX,
      cellY,
      timestamp: new Date(),
    };

    const socket = $socketStore;
    if (socket) {
      socket.emit('make_move', {
        matchId,
        move,
        playerSymbol: $mySymbol,
      });
    }
  }

  function handlePlayAgain() {
    goto('/');
  }

  function copyMatchId() {
    if (matchId) {
      navigator.clipboard.writeText(matchId).then(() => {
        showCopied = true;
        setTimeout(() => {
          showCopied = false;
        }, 2000);
      });
    }
  }
</script>

<div class="game-page">
  <div class="header-actions">
    <LanguageSwitcher />
  </div>

  <header>
    <h1>{$t('title')}</h1>
    {#if $gameStore}
      <div class="status-bar">
        <span class="symbol" class:active={$isMyTurn}>
          {$t('youAre')}: <strong>{$mySymbol}</strong>
        </span>
        <span class="turn">
          {#if $gameStore.status === 'PLAYING'}
            {#if $isMyTurn}
              <span class="your-turn">{$t('yourTurn')}</span>
            {:else}
              {$t('opponentsTurn')}
            {/if}
          {/if}
        </span>
      </div>
    {/if}
  </header>

  {#if error}
    <div class="error-toast">{error}</div>
  {/if}

  <main>
    {#if $gameStore}
      <GlobalBoard state={$gameStore} disabled={!$isMyTurn} onMove={handleMove} />

      <GameOverlay
        status={$gameStore.status}
        winner={$gameStore.winner}
        mySymbol={$mySymbol}
        {matchId}
        onPlayAgain={handlePlayAgain}
      />
    {:else}
      <div class="loading">{$t('loadingMatch')}</div>
    {/if}
  </main>

  <footer>
    <div class="match-info">
      <span>{$t('matchId')}: <code>{matchId}</code></span>
      <button class="copy-btn" on:click={copyMatchId}>
        {showCopied ? $t('copied') : $t('copyId')}
      </button>
    </div>
    <div class="footer-creator">
      <CreatorInfo />
    </div>
  </footer>
</div>

<style>
  .game-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f9fafb;
    padding: 1rem;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  .header-actions {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  header {
    text-align: center;
    margin-bottom: 2rem;
    width: 100%;
    max-width: 600px;
  }

  h1 {
    margin: 0 0 1rem 0;
    color: #111827;
    font-size: 1.875rem;
    font-weight: 800;
  }

  .status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .your-turn {
    color: #3b82f6;
    font-weight: bold;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }

  main {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .error-toast {
    position: fixed;
    top: 1rem;
    background: #fee2e2;
    color: #b91c1c;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid #f87171;
    z-index: 200;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  footer {
    margin-top: 2rem;
    color: #6b7280;
    font-size: 0.875rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding-bottom: 2rem;
  }

  .match-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .copy-btn {
    background: #e5e7eb;
    color: #374151;
    border: none;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 65px;
  }

  .copy-btn:hover {
    background: #d1d5db;
  }

  .copy-btn:active {
    transform: scale(0.95);
  }

  code {
    background: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
  }

  .loading {
    font-size: 1.25rem;
    color: #6b7280;
  }

  @media (max-width: 640px) {
    .header-actions {
      position: relative;
      top: 0;
      right: 0;
      margin-bottom: 1rem;
    }
  }
</style>
