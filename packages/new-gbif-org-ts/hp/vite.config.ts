import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
  ],
  root: 'hp',
  build: {
    emptyOutDir: true,
    lib: {
      entry: '../src/hp/entry.tsx',
      formats: ['iife'],
      name: 'GbifLib',
      fileName: 'gbif-lib',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
