import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "./src/api"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@router": path.resolve(__dirname, "./src/router"),
    },
  },
  build: {
    outDir: "./docs",
  },
});
