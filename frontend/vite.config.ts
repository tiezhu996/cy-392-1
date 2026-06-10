/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: { port: 18412 },
  test: {
    environment: "happy-dom",
    globals: true,
  },
});
