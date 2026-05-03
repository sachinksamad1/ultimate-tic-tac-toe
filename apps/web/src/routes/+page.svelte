<script lang="ts">
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/translations';
  import { BACKEND_URL } from '$lib/constants';
  import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
  import CreatorInfo from '$lib/components/CreatorInfo.svelte';

  let matchIdToJoin = '';
  let isLoading = false;
  let selectedDifficulty = 'easy';

  async function createMatch() {
    isLoading = true;
    try {
      const response = await fetch(`${BACKEND_URL}/api/matches`, {
        method: 'POST',
      });
      const match = await response.json();
      goto(`/play/${match.matchId}`);
    } catch (e) {
      alert('Failed to create match. Is the backend running?');
    } finally {
      isLoading = false;
    }
  }

  async function createBotMatch() {
    isLoading = true;
    try {
      const response = await fetch(`${BACKEND_URL}/api/matches/bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: selectedDifficulty })
      });
      const match = await response.json();
      goto(`/play/${match.matchId}`);
    } catch (e) {
      alert('Failed to create bot match. Is the backend running?');
    } finally {
      isLoading = false;
    }
  }

  function joinMatch() {
    if (matchIdToJoin.trim()) {
      goto(`/play/${matchIdToJoin.trim()}`);
    }
  }
</script>

<div class="header-actions">
  <LanguageSwitcher />
</div>

<main class="home-page">
  <div class="hero">
    <h1>{$t('title')}</h1>
    <p class="subtitle">{$t('subtitle')}</p>
  </div>

  <div class="actions">
    <section class="create">
      <h2>{$t('multiplayer')}</h2>
      <button class="primary" on:click={createMatch} disabled={isLoading}>
        {isLoading ? $t('creating') : $t('createMatch')}
      </button>
    </section>

    <div class="divider">
      <span>{$t('or')}</span>
    </div>

    <section class="bot">
      <h2>{$t('singlePlayer')}</h2>
      <div class="input-group">
        <select bind:value={selectedDifficulty} disabled={isLoading}>
          <option value="easy">{$t('easyBot')}</option>
          <option value="medium">{$t('mediumBot')}</option>
          <option value="hard">{$t('hardBot')}</option>
        </select>
        <button class="bot-btn" on:click={createBotMatch} disabled={isLoading}>
          {$t('playVsBot')}
        </button>
      </div>
    </section>

    <div class="divider">
      <span>{$t('or')}</span>
    </div>

    <section class="join">
      <h2>{$t('joinMatch')}</h2>
      <div class="input-group">
        <input 
          type="text" 
          placeholder={$t('matchIdPlaceholder')} 
          bind:value={matchIdToJoin}
          on:keydown={(e) => e.key === 'Enter' && joinMatch()}
        />
        <button class="secondary" on:click={joinMatch} disabled={!matchIdToJoin}>
          {$t('join')}
        </button>
      </div>
    </section>
  </div>

  <section class="rules">
    <h3>{$t('quickRules')}</h3>
    <ul>
      <li>{$t('rule1')}</li>
      <li>{$t('rule2')}</li>
      <li>{$t('rule3')}</li>
    </ul>
  </section>

  <footer class="page-footer">
    <CreatorInfo />
  </footer>
</main>

<style>
  .header-actions {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
  }

  .home-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .hero {
    text-align: center;
    margin-bottom: 3rem;
  }

  h1 {
    font-size: 3rem;
    font-weight: 800;
    color: #111827;
    margin: 0;
    letter-spacing: -0.025em;
  }

  .subtitle {
    font-size: 1.25rem;
    color: #4b5563;
    margin-top: 0.5rem;
  }

  .actions {
    background: #fff;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 450px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  section h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 1rem 0;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .primary {
    background: #3b82f6;
    color: #fff;
  }

  .primary:hover:not(:disabled) {
    background: #2563eb;
  }

  .bot-btn {
    background: #8b5cf6;
    color: #fff;
    width: auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .bot-btn:hover:not(:disabled) {
    background: #7c3aed;
  }

  .secondary {
    background: #10b981;
    color: #fff;
    width: auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .secondary:hover:not(:disabled) {
    background: #059669;
  }

  .input-group {
    display: flex;
    gap: 0.5rem;
  }

  input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    outline: none;
  }

  input:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  select {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background: #fff;
    outline: none;
    cursor: pointer;
  }

  select:focus {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }

  .divider {
    display: flex;
    align-items: center;
    color: #9ca3af;
    font-size: 0.875rem;
  }

  .divider::before, .divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }

  .divider span {
    padding: 0 1rem;
  }

  .rules {
    margin-top: 3rem;
    max-width: 450px;
    color: #4b5563;
  }

  .page-footer {
    margin-top: 4rem;
    padding-bottom: 2rem;
  }

  .rules h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  ul {
    padding-left: 1.25rem;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  li { margin-bottom: 0.5rem; }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    .header-actions {
      position: relative;
      top: 0;
      right: 0;
      margin-bottom: 2rem;
    }
    h1 {
      font-size: 2.25rem;
    }
  }
</style>
