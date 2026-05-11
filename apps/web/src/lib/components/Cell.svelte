<script lang="ts">
  import type { PlayerSymbol } from 'shared';

  export let value: PlayerSymbol | null;
  export let disabled: boolean = false;
  export let onClick: () => void;
  export let x: number;
  export let y: number;

  $: ariaLabel = value ? `Cell ${x},${y} marked ${value}` : `Empty cell at ${x},${y}`;
</script>

<button
  type="button"
  class="cell"
  class:x={value === 'X'}
  class:o={value === 'O'}
  class:empty={!value}
  disabled={disabled || value !== null}
  on:click={onClick}
  aria-label={ariaLabel}
>
  {#if value === 'X'}
    <svg viewBox="0 0 24 24" class="mark">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
      />
    </svg>
  {:else if value === 'O'}
    <svg viewBox="0 0 24 24" class="mark">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" fill="none" />
    </svg>
  {/if}
</button>

<style>
  .cell {
    aspect-ratio: 1;
    background: #fff;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15%;
    cursor: pointer;
    transition:
      background 0.2s,
      transform 0.1s;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  .cell:hover:not(:disabled) {
    background: #f0f7ff;
  }

  .cell:focus-visible {
    outline: 3px solid #3b82f6;
    outline-offset: -3px;
    z-index: 10;
  }

  .cell:active:not(:disabled) {
    transform: scale(0.95);
  }

  .mark {
    width: 100%;
    height: 100%;
  }

  .x {
    color: #ef4444;
  }

  .o {
    color: #3b82f6;
  }

  .cell:disabled {
    cursor: default;
  }
</style>
