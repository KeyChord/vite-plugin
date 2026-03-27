import type { Plugin } from "vite-plus";
import fs from "node:fs";
import path from "node:path";
import { viteStaticCopy } from "vite-plugin-static-copy";

const DEFAULT_INPUT_FILES_ROOT_DIRNAME = "src";

export type PluginOptions = {
  vendor?: string[];
};

export default function keychord(options?: PluginOptions): Plugin[] {
  const plugins: Plugin[] = [
    {
      name: "keychord",
      config(config) {
        const root = config.root ?? process.cwd();
        const srcDirpath = path.join(root, DEFAULT_INPUT_FILES_ROOT_DIRNAME);
        const input = fs
          .readdirSync(srcDirpath)
          .filter((file) => file.endsWith(".ts"))
          .map((file) => path.join(DEFAULT_INPUT_FILES_ROOT_DIRNAME, file));

        return {
          build: {
            // Since we target a "server" runtime (LLRT)
            ssr: true,

            // The standard for importing JavaScript files from chord TOML files `.toml` is to use #js
            outDir: "js",

            rolldownOptions: {
              input,

              // We want to produce self-contained files
              external: [],
              output: {
                codeSplitting: false,
              },
            },
          },
          ssr: {
            noExternal: true,
          },
        };
      },
    }
  ];

  if (options?.vendor?.length) {
    plugins.push(
      viteStaticCopy({
        targets: options.vendor?.map((packageName) => ({
          src: `node_modules/${packageName}`,
          dest: "js/vendor",
          rename: { stripBase: 1 },
        })),
      }) as unknown as Plugin
    )
  }

  return plugins;
}
