import type { Plugin } from 'vite-plus';

export default function keychord() {
  return {
    name: 'keychord',
    config(this: unknown) {
      return {
        build: {
          outDir: '@/'
        }
      }
    }
  } as const satisfies Plugin;
}