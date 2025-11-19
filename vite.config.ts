import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite + React
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // tudo que começa com /api vai para o backend Node (server.js)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
