<script lang="ts">
  import { locale, type Language } from '$lib/i18n/translations';

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' }
  ];

  function toggleLanguage(code: Language) {
    locale.set(code);
  }
</script>

<div class="language-switcher">
  {#each languages as lang}
    <button 
      class:active={$locale === lang.code} 
      on:click={() => toggleLanguage(lang.code)}
      title={lang.label}
    >
      <span class="flag">{lang.flag}</span>
      <span class="label">{lang.label}</span>
    </button>
  {/each}
</div>

<style>
  .language-switcher {
    display: flex;
    gap: 0.5rem;
    background: #fff;
    padding: 0.25rem;
    border-radius: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }

  button {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.75rem;
    border-radius: 1.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
    transition: all 0.2s;
  }

  button:hover {
    background: #f3f4f6;
  }

  button.active {
    background: #3b82f6;
    color: #fff;
  }

  .flag {
    font-size: 1.1rem;
  }

  @media (max-width: 640px) {
    .label {
      display: none;
    }
    button {
      padding: 0.4rem;
    }
  }
</style>
