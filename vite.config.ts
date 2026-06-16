import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Set BASE to match your GitHub repo name, e.g. '/rfq-form-explorer/'
// In local dev it falls back to '/' automatically via VITE_BASE env var
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE ?? '/rfq-form-explorer/',
})
