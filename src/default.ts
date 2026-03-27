import type { Plugin } from "vite-plus";
import fs from "node:fs";
import path from "node:path";
import { viteStaticCopy } from "vite-plugin-static-copy";

const DEFAULT_INPUT_FILES_ROOT_DIRNAME = "src";

export type PluginOptions = {
  vendor?: string[];
};

export default function keychord(options?: PluginOptions): any[] {
  const plugins: Plugin[] = [
    {
      name: "keychord",
      config(config) {
        const root = config.root ?? process.cwd();
        const srcDirpath = path.join(root, DEFAULT_INPUT_FILES_ROOT_DIRNAME);
        let tsRoot = fs.existsSync(path.join(srcDirpath, "js"))
          ? path.join(srcDirpath, "js")
          : srcDirpath;

        const input = fs
          .readdirSync(tsRoot)
          .filter((file) => file.endsWith(".ts"))
          .map((file) => path.join(tsRoot, file));

        if (tsRoot.endsWith("/js") && fs.existsSync(path.join(srcDirpath, "bin"))) {
          const tsBinDirpath = path.join(srcDirpath, "bin");
          input.push(
            ...fs
              .readdirSync(tsBinDirpath)
              .filter((file) => file.endsWith(".ts"))
              .map((file) => path.join(tsBinDirpath, file)),
          );
        }

        return {
          build: {
            // Since we target a "server" runtime (LLRT)
            ssr: true,

            // The standard for importing JavaScript files from chord TOML files `.toml` is to use #js
            outDir: "js",

            rolldownOptions: {
              input,

              // We want to produce self-contained files
              external: ["chord"],
            },
          },
          ssr: {
            noExternal: true,
          },
        };
      },
    },
  ];

  if (options?.vendor?.length) {
    plugins.push(
      viteStaticCopy({
        /** @see https://github.com/sapphi-red/vite-plugin-static-copy/issues/216 */
        environment: "ssr",
        targets: options.vendor?.map((packageName) => ({
          src: `node_modules/${packageName}/js`,
          dest: "vendor",
          rename: { stripBase: 1 },
        })),
      }) as unknown as Plugin,
    );
  }

  return plugins;
}
