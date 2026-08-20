import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    // @react-pdf/renderer (and its @react-pdf/* deps) reference Node globals
    // such as `process` and `Buffer`. Vite's production build strips these,
    // which made the lazy-loaded PDF chunk throw at runtime. Polyfill them.
    nodePolyfills({
      globals: { Buffer: true, process: true },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
