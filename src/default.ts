import type { Plugin } from "vite-plus";
import fs from "node:fs";
import path from "node:path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import virtual from 'vite-plugin-virtual';

export type PluginOptions = {
  vendor?: string[];
};

export default function chordPackage(options?: PluginOptions): any[] {
  const plugins: any[] = [
    virtual({
      'virtual:empty': '',
    }),
    {
      name: "keychord",
      config(config) {
        const root = config.root ?? process.cwd();
        const srcJsDirpath = path.join(root, 'src/js');
        let input: string | Record<string, string> = {};

        if (fs.existsSync(srcJsDirpath) && fs.statSync(srcJsDirpath).isDirectory()) {
          for (const filename of fs.readdirSync(srcJsDirpath).filter((file) => file.endsWith(".ts"))) {
            input[path.parse(filename).name] = path.join(srcJsDirpath, filename);
          }
        }

        if (Object.keys(input).length === 0) {
          input['noop'] = "virtual:empty";
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
    } satisfies Plugin,
  ];

  if (options?.vendor?.length) {
    plugins.push(
      viteStaticCopy({
        /** @see https://github.com/sapphi-red/vite-plugin-static-copy/issues/216 */
        environment: "ssr",
        targets: options.vendor?.map((packageName) => ({
          src: `node_modules/${packageName}/js`,
          dest: ".",
          rename: { stripBase: 1 },
        })),
      })
    );
  }

  return plugins;
}
