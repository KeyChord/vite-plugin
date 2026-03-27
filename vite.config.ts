import { defineConfig } from 'vite-plus';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/default.ts',
      fileName: 'default',
      formats: ['es']
    }
  }
});
