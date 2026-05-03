import { writable } from 'svelte/store';
import { io, Socket } from 'socket.io-client';
import { browser } from '$app/environment';

function createSocketStore() {
  const { subscribe, set } = writable<Socket | null>(null);

  if (browser) {
    const backendUrl = import.meta.env.PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const socket = io(backendUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    set(socket);
  }

  return {
    subscribe,
    connect: () => {
      if (browser) {
        subscribe(s => s?.connect())();
      }
    },
    disconnect: () => {
      if (browser) {
        subscribe(s => s?.disconnect())();
      }
    }
  };
}

export const socketStore = createSocketStore();
