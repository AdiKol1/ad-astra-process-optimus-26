import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
        presets: ['@babel/preset-react']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled']
  },
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@mui/icons-material',
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'framer-motion'
    ],
    exclude: ['@mui/material/styles'],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  server: {
    port: 8080,
    host: true,
    strictPort: false,
    hmr: {
      overlay: false,
      clientPort: 8080
    },
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    cssMinify: true,
    target: 'es2020',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          'ui': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled'
          ]
        }
      }
    }
  }
})