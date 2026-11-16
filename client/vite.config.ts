/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import zlib from 'node:zlib';
import { Transform } from 'node:stream';

// Polyfill Node 22+ zlib.createZstdDecompress for undici / jsdom compatibility on Node < 22.12
if (typeof (zlib as any).createZstdDecompress !== 'function') {
  (zlib as any).createZstdDecompress = function () {
    return new Transform({
      transform(chunk, _enc, cb) {
        cb(null, chunk);
      },
    });
  };
}
if (!(zlib as any).constants) {
  (zlib as any).constants = {};
}
if (typeof (zlib as any).constants.ZSTD_d_windowLogMax === 'undefined') {
  (zlib as any).constants.ZSTD_d_windowLogMax = 23;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'framer-motion', 'clsx', 'tailwind-merge', 'sonner'],
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
