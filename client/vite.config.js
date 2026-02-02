import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Bazen port çakışması bu hatayı tetikler, portu sabitleyelim
    port: 5173,
  }
})