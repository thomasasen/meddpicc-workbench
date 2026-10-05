import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: 'app',
  base: '/meddpicc-workbench/',
  plugins: [vue()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
