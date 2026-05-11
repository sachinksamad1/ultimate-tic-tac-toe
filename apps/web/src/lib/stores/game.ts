import { writable, derived } from 'svelte/store';
import type { GameState, PlayerSymbol } from 'shared';

function createGameStore() {
  const { subscribe, set, update } = writable<GameState | null>(null);

  return {
    subscribe,
    setState: (state: GameState) => set(state),
    reset: () => set(null),
    updateState: (newState: GameState) => update(() => newState),
  };
}

export const gameStore = createGameStore();

export const mySymbol = writable<PlayerSymbol | null>(null);

export const isMyTurn = derived([gameStore, mySymbol], ([$gameStore, $mySymbol]) => {
  if (!$gameStore || !$mySymbol) return false;
  return $gameStore.activePlayer === $mySymbol && $gameStore.status === 'PLAYING';
});

export const activeBoardIndex = derived(
  gameStore,
  ($gameStore) => $gameStore?.nextTargetBoard ?? null,
);
