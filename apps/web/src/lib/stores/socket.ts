import { writable } from 'svelte/store';
import { io, Socket } from 'socket.io-client';
import { browser } from '$app/environment';

import { BACKEND_URL } from '$lib/constants';

function createSocketStore() {
  const { subscribe, set } = writable<Socket | null>(null);

  if (browser) {
    const socket = io(BACKEND_URL, {
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
