import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// The demo deployment must never be indexed: noindex in the page and a
// robots.txt that disallows everything. Production gets neither.
const demoNoIndex = (): Plugin => ({
  name: 'b2bar-demo-noindex',
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: { name: 'robots', content: 'noindex, nofollow' },
      injectTo: 'head',
    },
  ],
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'robots.txt',
      source: 'User-agent: *\nDisallow: /\n',
    });
  },
});

// Reads VITE_DEMO_MODE from the shell and from .env files alike.
const isDemoBuild =
  loadEnv('production', process.cwd(), 'VITE_').VITE_DEMO_MODE === 'true';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ...(isDemoBuild ? [demoNoIndex()] : [])],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@images': path.resolve(__dirname, 'public/images'),
      '@icons': path.resolve(__dirname, 'public/icons'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@ui': path.resolve(__dirname, 'src/components/ui'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  server: {
    open: '.',
    port: 3000,
  },
});
