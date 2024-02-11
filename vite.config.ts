import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/marvel': {
        target: 'https://gateway.marvel.com:443/v1/public',
        changeOrigin: false,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api\/marvel/, '')
      }
    }
  },
  plugins: [react()]
});
