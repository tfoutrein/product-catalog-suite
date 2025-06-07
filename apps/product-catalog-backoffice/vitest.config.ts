import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [svelte({ preprocess: vitePreprocess() })],
  test: {
    environment: 'jsdom',
    globals: true,
    threads: false
  }
});
