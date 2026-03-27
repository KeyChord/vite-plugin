import type { Plugin } from "vite-plus";
import fs from "node:fs";
import path from "node:path";
import { viteStaticCopy } from "vite-plugin-static-copy";

const DEFAULT_INPUT_FILES_ROOT_DIRNAME = "src";

export type PluginOptions = {
  vendor?: string[];
};

export default function chordPackage(options?: PluginOptions): any[] {
  const plugins: Plugin[] = [
    {
      name: "keychord",
      config(config) {
        const root = config.root ?? process.cwd();
        const srcDirpath = path.join(root, DEFAULT_INPUT_FILES_ROOT_DIRNAME);
        let tsRoot = fs.existsSync(path.join(srcDirpath, "js"))
          ? path.join(srcDirpath, "js")
          : srcDirpath;

        const input: Record<string, string> = {};

        for (const filename of fs.readdirSync(tsRoot).filter((file) => file.endsWith(".ts"))) {
          input[path.parse(filename).name] = path.join(tsRoot, filename);
        }

        return {
          build: {
            // Since we target a "server" runtime (LLRT)
            ssr: true,
            emptyOutDir: false,
            outDir: "js",

            rolldownOptions: {
              input,

              // We need to produce self-contained files
              external: ["chord", ...(options?.vendor ?? [])],
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
          dest: "js",
          rename: { stripBase: 1 },
        })),
      }) as unknown as Plugin,
    );
  }

  return plugins;
}
