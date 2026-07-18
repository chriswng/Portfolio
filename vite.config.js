import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Relative base so the build works whether served from a domain root
// (itschriswang.github.io) or a project sub-path (/portfolio/).
// Multi-page: the main profile at /, work samples at /work/, the
// life-footprint dashboard at /footprint/, and its basis of preparation
// at /footprint/method/.
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
        footprint: resolve(__dirname, 'footprint/index.html'),
        footprintMethod: resolve(__dirname, 'footprint/method/index.html'),
      },
      output: {
        // Stable vendor chunks: both pages share react/framer-motion, and the
        // heavier chart.js/ogl code is only fetched by the main page. Splitting
        // them lets the browser cache vendors across deploys and pages.
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          chart: ['chart.js'],
          ogl: ['ogl'],
        },
      },
    },
  },
});
