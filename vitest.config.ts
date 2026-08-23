import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    globals: false,
    coverage: {
      reporter: ["text", "html"],
      include: ["src/lib/**/*.ts"],
    },
  },
  css: {
    // Tests are pure logic — no CSS processing. Provide an inline empty
    // PostCSS plugin list so Vite does NOT auto-discover postcss.config.mjs
    // (which uses the Next.js string-plugin form that Vite's loader rejects).
    postcss: { plugins: [] },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
