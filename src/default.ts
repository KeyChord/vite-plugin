import type { Plugin } from 'vite-plus';
import fs from 'node:fs';
import path from 'node:path'

export default function keychord() {
  return [
    {
      name: 'keychord',
      config(config) {
        const root = config.root ?? process.cwd();
        const srcDirpath = path.join(root, 'src');
        const input = fs.readdirSync(srcDirpath).filter(file => file.endsWith('.ts')).map(file => path.join('src', file));

        return {
          build: {
            // Since we target a "server" runtime (LLRT)
            ssr: true,

            // The standard for importing from chords.toml
            outDir: 'exports',

            rolldownOptions: {
              input,

              // We want to produce self-contained files
              external: [],
              output: {
                codeSplitting: false,
              }
            }
          },
          ssr: {
            noExternal: true,
          }
        }
      }
    } satisfies Plugin
  ]
}