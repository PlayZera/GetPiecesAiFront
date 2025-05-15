import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
            tailwindcss(),  
  ],
  server: {
    allowedHosts: [
      '2b00-138-94-88-239.ngrok-free.app'
    ]
  }
})
