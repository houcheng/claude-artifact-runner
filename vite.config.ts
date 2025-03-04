import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import Pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Pages({
      dirs: [
          { dir: 'src/artifacts', baseRoute: '' },
          { dir: 'src/artifacts/a', baseRoute: '' },
          { dir: 'src/artifacts/b', baseRoute: '' },
          { dir: 'src/artifacts/c', baseRoute: '' },
          { dir: 'src/artifacts/d', baseRoute: '' },
          { dir: 'src/artifacts/e', baseRoute: '' },
          { dir: 'src/artifacts/f', baseRoute: '' },
          { dir: 'src/artifacts/g', baseRoute: '' },
      ],
      extensions: ['jsx', 'tsx'],   
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src'),
    },
  }
})
