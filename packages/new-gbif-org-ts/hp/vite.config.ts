import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [react()],
  root: 'hp',
  build: {
    emptyOutDir: true,
    lib: {
      entry: '../src/hp/entry.tsx',
      formats: ['es'],
      fileName: 'gbif-lib',
    },
  },
});
