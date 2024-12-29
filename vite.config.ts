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
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript'
        ]
      }
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
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
<<<<<<< HEAD
    exclude: ['@mui/material/styles']
=======
    exclude: ['@mui/material/styles'],
    esbuildOptions: {
      target: 'es2020',
      tsconfigRaw: {
        compilerOptions: {
          target: 'es2020',
          jsx: 'preserve',
          composite: true,
          module: 'ESNext',
          moduleResolution: 'bundler',
          allowSyntheticDefaultImports: true,
          skipLibCheck: true,
          noEmit: false,
          isolatedModules: true,
          strict: true,
          esModuleInterop: true,
          baseUrl: '.',
          paths: {
            "@/*": ["./src/*"]
          }
        },
        include: ["src/**/*.ts", "src/**/*.tsx"],
        exclude: ["node_modules"],
        references: [{ path: "./tsconfig.node.json" }]
      }
    }
>>>>>>> 79d3f1401aad9e8ef80acc2e444faa842719d73b
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
}))
