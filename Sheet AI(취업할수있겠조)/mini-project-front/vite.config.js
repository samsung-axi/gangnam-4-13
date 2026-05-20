import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import envCompatible from 'vite-plugin-env-compatible';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react({
      babel: {
        presets: ['jotai/babel/preset'],
      },
    }),
    envCompatible(),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      // eslint-disable-next-line no-undef
      { find: '@src', replacement: path.resolve(__dirname, 'src') },
      // eslint-disable-next-line no-undef
      {
        find: '@components',
        replacement: path.resolve(__dirname, 'src/components'),
      },
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 5555,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: ['grand-socially-reindeer.ngrok-free.app'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'asset',
  },
});
