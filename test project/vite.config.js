import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api/onesignal': {
        target: 'https://onesignal.com/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/onesignal/, ''),
      },
    },
  },
})
