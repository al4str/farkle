import { readFile, writeFile, glob } from "node:fs/promises";

import type { Plugin } from "vite";
import { transform } from "lightningcss";

const MODULE_GLOB = "src/**/*.module.css";

export function vitePluginCssModulesDts(): Plugin {
  return {
    name: "css-modules-dts",
    async buildStart() {
      await cssModulesDtsGenerate();
    },
    async handleHotUpdate(ctx) {
      if (ctx.file.endsWith(".module.css")) {
        await writeDts(ctx.file);
      }
    },
  };
}

async function writeDts(file: string): Promise<void> {
  const { exports } = transform({
    filename: file,
    code: await readFile(file),
    cssModules: true,
  });
  const keys = Object.keys(exports ?? {}).toSorted();
  const body = keys.map((key) => `  readonly ${JSON.stringify(key)}: string;`).join("\n");
  const next = `declare const styles: {\n${body}\n};\nexport default styles;\n`;

  const out = `${file}.d.ts`;
  const prev = await readFile(out, "utf8").catch(() => "");
  if (prev !== next) {
    await writeFile(out, next);
  }
}

async function cssModulesDtsGenerate(): Promise<void> {
  for await (const file of glob(MODULE_GLOB)) {
    await writeDts(file);
  }
}

if (import.meta.main) {
  await cssModulesDtsGenerate();
}
