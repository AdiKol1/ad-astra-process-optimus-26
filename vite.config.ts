import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@chakra-ui/react',
      '@emotion/react',
      '@emotion/styled',
      'zustand',
      'react-router-dom'
    ]
  },
  server: {
    port: 4000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
          'router-vendor': ['react-router-dom'],
          'store-vendor': ['zustand']
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
})
