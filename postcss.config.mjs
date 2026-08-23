import tailwindcss from "@tailwindcss/postcss";

// Function-call form is the canonical Tailwind CSS v4 setup and is resolved
// identically by Next.js (postcss-load-config) and Vite/vitest. The previous
// string form `plugins: ["@tailwindcss/postcss"]` is accepted by Next.js but
// rejected by Vite's PostCSS loader, which broke `bun run test`.
const config = {
  plugins: [tailwindcss()],
};

export default config;

