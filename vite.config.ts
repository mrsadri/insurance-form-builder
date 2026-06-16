import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // '/' in dev so localhost:5173/ works; GH Pages path only on build
  base: command === 'build'
    ? (process.env.VITE_BASE ?? '/insurance-form-builder/')
    : '/',
}))
