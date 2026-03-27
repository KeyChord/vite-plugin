import { defineConfig } from 'vite-plus';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    outDir: 'exports',
    lib: {
      entry: 'src/default.ts',
      fileName: 'default',
      formats: ['es'],
    },
  }
});
