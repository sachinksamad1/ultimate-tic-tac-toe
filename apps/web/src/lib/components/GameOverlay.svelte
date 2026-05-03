<script lang="ts">
  import { t } from '$lib/i18n/translations';
  import type { PlayerSymbol, MatchStatus } from 'shared';

  export let status: MatchStatus;
  export let winner: PlayerSymbol | 'DRAW' | null;
  export let mySymbol: PlayerSymbol | null;
  export let matchId: string = '';
  export let onPlayAgain: () => void;

  let showCopied = false;

  $: isWinner = winner === mySymbol;
  $: isDraw = winner === 'DRAW';

  function copyMatchId() {
    navigator.clipboard.writeText(matchId).then(() => {
      showCopied = true;
      setTimeout(() => { showCopied = false; }, 2000);
    });
  }
</script>

{#if status === 'WAITING'}
  <div class="overlay waiting">
    <div class="card">
      <div class="loader"></div>
      <h2>{$t('waitingForOpponent')}</h2>
      <p>{$t('shareMatchId')}</p>
      
      <div class="match-display">
        <code>{matchId}</code>
        <button class="copy-btn" on:click={copyMatchId}>
          {showCopied ? $t('copied') : $t('copyId')}
        </button>
      </div>

      <p class="hint">{$t('orSendUrl')}</p>
    </div>
  </div>
{:else if status === 'FINISHED'}
  <div class="overlay finished">
    <div class="card">
      {#if isWinner}
        <h2 class="success">{$t('victory')}</h2>
        <p>{$t('victoryDesc')}</p>
      {:else if isDraw}
        <h2>{$t('draw')}</h2>
        <p>{$t('drawDesc')}</p>
      {:else}
        <h2 class="error">{$t('defeat')}</h2>
        <p>{$t('defeatDesc')}</p>
      {/if}
      
      <button class="primary" on:click={onPlayAgain}>{$t('returnToLobby')}</button>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    backdrop-filter: blur(4px);
  }

  .card {
    background: #fff;
    padding: 2.5rem;
    border-radius: 1rem;
    text-align: center;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  h2 { margin-top: 0; margin-bottom: 1rem; }
  p { color: #666; margin-bottom: 2rem; }

  .success { color: #10b981; }
  .error { color: #ef4444; }

  button.primary {
    background: #3b82f6;
    color: #fff;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  button.primary:hover {
    background: #2563eb;
  }

  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .match-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background: #f3f4f6;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  code {
    font-family: monospace;
    color: #374151;
    font-weight: 600;
  }

  .copy-btn {
    background: #3b82f6;
    color: #fff;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 0.4rem;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 80px;
  }

  .copy-btn:hover {
    background: #2563eb;
  }

  .hint {
    font-size: 0.8rem;
    color: #9ca3af;
    margin-top: 0;
  }

  .loader {
    margin-bottom: 1.5rem;
  }
</style>
