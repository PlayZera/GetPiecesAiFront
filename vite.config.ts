import { defineConfig, loadEnv, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }: UserConfig) => {

  const env = loadEnv(mode || 'development', process.cwd());

  return {
    plugins: [react(),
    tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_DE_PRODUTOS_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      allowedHosts: ['getpiecesaifront-production.up.railway.app']
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    preview: {
      port: 4173,
      allowedHosts: ['getpiecesaifront-production.up.railway.app']
    },

  }
})
