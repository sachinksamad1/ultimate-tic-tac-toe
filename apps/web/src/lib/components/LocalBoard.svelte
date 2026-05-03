<script lang="ts">
  import type { LocalBoard, PlayerSymbol } from 'shared';
  import Cell from './Cell.svelte';

  export let board: LocalBoard;
  export let isActive: boolean;
  export let disabled: boolean;
  export let onMove: (boardIndex: number, cellX: number, cellY: number) => void;

  $: boardWinner = board.winner;
</script>

<div 
  class="local-board" 
  class:active={isActive}
  class:won-x={boardWinner === 'X'}
  class:won-o={boardWinner === 'O'}
  class:draw={boardWinner === 'DRAW'}
>
  <div class="cells-grid">
    {#each board.cells as row, y}
      {#each row as cell, x}
        <Cell 
          value={cell.value}
          disabled={disabled || (isActive === false && isActive !== null)}
          {x} {y}
          onClick={() => onMove(board.id, x, y)}
        />
      {/each}
    {/each}
  </div>

  {#if boardWinner && boardWinner !== 'DRAW'}
    <div class="winner-overlay">
      {#if boardWinner === 'X'}
        <svg viewBox="0 0 24 24" class="large-mark x">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      {:else if boardWinner === 'O'}
        <svg viewBox="0 0 24 24" class="large-mark o">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      {/if}
    </div>
  {:else if boardWinner === 'DRAW'}
     <div class="winner-overlay draw">
        <span>DRAW</span>
     </div>
  {/if}
</div>

<style>
  .local-board {
    position: relative;
    border: 3px solid transparent;
    transition: border-color 0.3s, background 0.3s;
    background: #eee;
    padding: 2px;
  }

  .active {
    border-color: #3b82f6;
    background: #dbeafe;
  }

  .cells-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 2px;
  }

  .winner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.7);
    pointer-events: none;
    z-index: 5;
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }

  .large-mark {
    width: 80%;
    height: 80%;
    opacity: 0.8;
  }

  .x { color: #ef4444; }
  .o { color: #3b82f6; }

  .draw {
    background: rgba(200, 200, 200, 0.6);
  }

  .draw span {
    font-weight: bold;
    color: #666;
    font-size: 1.2rem;
  }
</style>
