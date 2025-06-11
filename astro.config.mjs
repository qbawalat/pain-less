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
    port: parseInt(process.env.PORT || "8080", 10),
    host: process.env.HOST || "0.0.0.0",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: node({
    mode: "standalone",
  }),
  experimental: { session: true },
});
