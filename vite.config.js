import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Configuración de Vite para AM · Productivity OS
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
