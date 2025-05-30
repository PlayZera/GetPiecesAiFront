import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_DE_PRODUTOS_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),

          configure: (proxy, options) => {
            proxy.on('proxyRes', (proxyRes) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = '*'
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
              proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            })
          }
        },
        allowedHosts: ['https://getpiecesaifront-production.up.railway.app']
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    },
    preview: {
      port: 4173,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      allowedHosts: ['https://getpiecesaifront-production.up.railway.app']
    }
  }
})