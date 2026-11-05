import { defineConfig } from 'vite';

export default defineConfig({
  base: '/block-city/',
  worker: { format: 'es' },
  server: { headers: { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' } },
});
