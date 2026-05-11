<script lang="ts">
  import type { GameState } from 'shared';
  import LocalBoard from './LocalBoard.svelte';

  export let state: GameState;
  export let disabled: boolean;
  export let onMove: (boardIndex: number, cellX: number, cellY: number) => void;

  $: activeBoardIndex = state.nextTargetBoard;
</script>

<div class="global-board">
  {#each state.localBoards as board, i (board.id || i)}
    <LocalBoard
      {board}
      isActive={activeBoardIndex === null || activeBoardIndex === i}
      {disabled}
      {onMove}
    />
  {/each}
</div>

<style>
  .global-board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 12px;
    max-width: 600px;
    margin: 0 auto;
    background: #ccc;
    padding: 8px;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 640px) {
    .global-board {
      gap: 6px;
      padding: 4px;
    }
  }
</style>
