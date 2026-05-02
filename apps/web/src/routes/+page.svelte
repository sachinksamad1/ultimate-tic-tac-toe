<script lang="ts">
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';
  import type { GameState } from 'shared';

  let status = 'Connecting...';

  onMount(() => {
    const socket = io('http://localhost:3001');

    socket.on('connect', () => {
      status = 'Connected to Backend';
    });

    socket.on('disconnect', () => {
      status = 'Disconnected';
    });

    return () => {
      socket.disconnect();
    };
  });
</script>

<main>
  <h1>Ultimate Tic-Tac-Toe</h1>
  <p>Status: {status}</p>
</main>

<style>
  main {
    text-align: center;
    padding: 2em;
    font-family: sans-serif;
  }
</style>
