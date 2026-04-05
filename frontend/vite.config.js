import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9091',
        changeOrigin: true,
      },
      '/v3': {
        target: 'http://localhost:9091',
        changeOrigin: true,
      },
      '/swagger-ui': {
        target: 'http://localhost:9091',
        changeOrigin: true,
      },
    },
  },
})
