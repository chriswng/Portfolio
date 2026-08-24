import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Relative base so the build works whether served from a domain root
// (itschriswang.github.io) or a project sub-path (/portfolio/).
// Multi-page. Public: the main profile at /, work samples at /work/, the
// life-footprint dashboard at /footprint/ (basis of preparation at
// /footprint/method/), Sustainability Daily at /daily/ and Australia's Climate
// Progress at /progress/. Unlisted: the drafts index at /lab/ and the four
// tools it gates, /targets/, /fashion/, /super/ (methodology at
// /super/method/) and /grid/. The drafts are built and deployed like any other
// page; nothing public links to them and each asks for a passphrase.
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
        fashion: resolve(__dirname, 'fashion/index.html'),
        grid: resolve(__dirname, 'grid/index.html'),
        daily: resolve(__dirname, 'daily/index.html'),
        superHoldings: resolve(__dirname, 'super/index.html'),
        superMethod: resolve(__dirname, 'super/method/index.html'),
        progress: resolve(__dirname, 'progress/index.html'),
        targets: resolve(__dirname, 'targets/index.html'),
        lab: resolve(__dirname, 'lab/index.html'),
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
