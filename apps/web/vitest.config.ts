import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    server: {
      deps: {
        inline: [/@testing-library\/svelte/],
      },
    },
  },
  resolve: {
    conditions: ['browser'],
    alias: {
      shared: path.resolve(__dirname, '../../packages/shared/src/index.ts'),
    },
  },
});
