/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react({
      // This is the recommended way to use Emotion with Vite
      jsxImportSource: '@emotion/react',
      babel: {
        // This is important for Emotion to work properly
        plugins: ['@emotion/babel-plugin']
      }
    }),
    tsconfigPaths()
  ],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    sourcemap: true,
    outDir: 'dist'
  }
});