import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // דרוש כדי שהנכסים (JS/CSS) ייטענו נכון תחת GitHub Pages,
  // שמגיש את האתר תחת https://<user>.github.io/book-tracker/.
  base: '/book-tracker/',
  plugins: [react(), tailwindcss()],
})
