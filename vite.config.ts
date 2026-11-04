import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Subpath do GitHub Pages: https://renan-frontend.github.io/portifolio/
const GITHUB_PAGES_BASE = '/portifolio/'

/**
 * No dev e no build local a raiz fica "/".
 * O workflow de Pages define GITHUB_PAGES=true para publicar no subpath do repositório.
 */
export default defineConfig(({ command }) => ({
  base:
    command === 'build' && process.env.GITHUB_PAGES === 'true'
      ? GITHUB_PAGES_BASE
      : '/',
  plugins: [react(), tailwindcss()],
}))
