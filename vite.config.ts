import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // 相对 base：兼容 GitHub Pages 任意子路径，且本地 dev/preview 无需带前缀
  base: './',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
  },
});
