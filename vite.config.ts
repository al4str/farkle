import type { IncomingMessage, ServerResponse } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { Plugin, UserConfig } from "vite";
import { defineConfig } from "vite";
import vitePluginSolid from "vite-plugin-solid";

import { vitePluginCssModulesDts } from "./vite/cssModulesDts.ts";

export default defineConfig({
  plugins: [
    vitePluginSolid(),
    vitePluginCssModulesDts(),
    vitePluginAssetsHeaders(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: [
      {
        find: /^three$/,
        replacement: "three/webgpu",
      },
    ],
  },
  assetsInclude: [
    "**/*.webp",
  ],
  css: {
    transformer: "lightningcss",
  },
  build: {
    cssMinify: "lightningcss",
  },
  optimizeDeps: {
    exclude: [
      "three/examples/jsm/inspector/Inspector.js",
    ],
  },
  server: {
    ...getServerConfig(),
  },
});

function getServerConfig(): UserConfig["server"] {
  const certFilePath = fileURLToPath(new URL(".certs/dev-cert.pem", import.meta.url));
  const keyFilePath = fileURLToPath(new URL(".certs/dev-key.pem", import.meta.url));

  if (existsSync(certFilePath) && existsSync(keyFilePath)) {
    return {
      https: {
        cert: readFileSync(certFilePath, "utf-8"),
        key: readFileSync(keyFilePath, "utf-8"),
      },
    };
  }
  return {};
}

function vitePluginAssetsHeaders(): Plugin {
  return {
    name: "asset-headers",
    configureServer(server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url?.startsWith("/assets/")) {
          res.setHeader("Cache-Control", "no-cache");
        }
        next();
      });
    },
  };
}
