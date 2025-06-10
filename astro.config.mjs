// @ts-check
import { defineConfig } from "astro/config";
import process from "node:process";

import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react(), sitemap()],
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    host: process.env.HOST || "localhost",
  },
  vite: {
    plugins: [tailwindcss()],
    define: {
      "process.env.OPENROUTER_API_KEY": JSON.stringify(process.env.OPENROUTER_API_KEY),
    },
  },
  adapter: node({
    mode: "standalone",
  }),
  experimental: { session: true },
});
