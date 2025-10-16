import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'node:path';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'desktop/dist/main',
      rollupOptions: {
        input: resolve(__dirname, 'desktop/main/index.ts'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'desktop/dist/preload',
      rollupOptions: {
        input: resolve(__dirname, 'desktop/preload/index.ts'),
        output: {
          format: 'cjs',
          entryFileNames: 'index.cjs',
        },
      },
    },
  },
  renderer: {
    root: resolve(__dirname, 'desktop/renderer'),
    resolve: {
      alias: {
        '@': resolve(__dirname, 'desktop/renderer/src'),
      },
    },
    build: {
      outDir: resolve(__dirname, 'desktop/dist/renderer'),
      rollupOptions: {
        input: resolve(__dirname, 'desktop/renderer/index.html'),
      },
    },
  },
});
