import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base: "./" keeps every asset URL relative (./assets/...), so the same build works
// at https://user.github.io/, at https://user.github.io/repository/ and on a custom domain.
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  build: {
    target: "es2022",
    assetsInlineLimit: 0,
  },
});
