import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { componentTagger } from "lovable-tagger"

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
        presets: ['@babel/preset-react']
      }
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
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
      target: 'es2020',
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          target: 'es2020',
          jsx: 'preserve'
        }
      }
    }
  },
  server: {
    host: "::",
    port: 8080,
    strictPort: false,
    hmr: {
      overlay: false,
      clientPort: 8080,
      protocol: 'ws'
    },
    watch: {
      usePolling: true
    },
    cors: true
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
}))