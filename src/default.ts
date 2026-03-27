import type { Plugin } from 'vite-plus';
import fs from 'node:fs';
import path from 'node:path'

const DEFAULT_INPUT_FILES_ROOT_DIRNAME = 'src';

export default function keychord() {
  return [
    {
      name: 'keychord',
      config(config) {
        const root = config.root ?? process.cwd();
        const srcDirpath = path.join(root, DEFAULT_INPUT_FILES_ROOT_DIRNAME);
        const input = fs.readdirSync(srcDirpath).filter(file => file.endsWith('.ts')).map(file => path.join(DEFAULT_INPUT_FILES_ROOT_DIRNAME, file));

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