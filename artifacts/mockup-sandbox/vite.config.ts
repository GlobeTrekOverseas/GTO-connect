import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "node:url";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin";

const port = Number(process.env.PORT ?? 4174);
const basePath = process.env.BASE_PATH ?? "/";
const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: basePath,
  plugins: [
    mockupPreviewPlugin(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(appRoot, "src"),
    },
  },
  root: appRoot,
  build: {
    outDir: path.resolve(appRoot, "dist"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
