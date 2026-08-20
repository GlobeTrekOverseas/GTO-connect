import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, here, '');
  const apiPort = environment.API_PORT || environment.PORT || process.env.API_PORT || '5000';
  const apiTarget = 'http://127.0.0.1:' + apiPort;

  return {
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(here, 'src'),
      '@assets': path.resolve(here, '..', '..', 'attached_assets'),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: here,
  server: { host: '127.0.0.1', port: 4173, strictPort: true, proxy: { '/api': apiTarget } },
  preview: { host: '127.0.0.1', port: 4173, proxy: { '/api': apiTarget } },
  };
});
