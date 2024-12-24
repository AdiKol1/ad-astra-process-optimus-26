/// <reference types="vitest" />
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
        presets: ['@babel/preset-react', '@babel/preset-typescript']
      }
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    port: 8086,
    strictPort: true,
    host: true,
    fs: {
      strict: true,
      allow: ['..']
    }
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
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
          jsx: 'preserve',
          composite: true,
          noEmit: false,
          module: 'ESNext',
          moduleResolution: 'node',
          allowSyntheticDefaultImports: true,
          skipLibCheck: true
        }
      }
    }
  }
}))
