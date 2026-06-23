import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Relative base so the build works whether served from a domain root
// (itschriswang.github.io) or a project sub-path (/portfolio/).
// Multi-page: the main profile at / and the work-samples page at /work/.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        work: resolve(__dirname, 'work/index.html'),
      },
    },
  },
});
