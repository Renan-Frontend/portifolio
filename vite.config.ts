import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Site na raiz do user Pages: https://renan-frontend.github.io/
 * (o subpath /portifolio/ só redireciona para a raiz).
 */
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
})
