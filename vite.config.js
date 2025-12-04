import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const host = process.env.TAURI_DEV_HOST;

// Determine if we are building for GitHub Pages
const isGitHubPages = process.env.VITE_APP_ENV === 'github-pages';
const base = isGitHubPages ? '/Timers/' : './'; // Assuming repository name is Timers

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  base: base, // Set base path conditionally
  build: {
    outDir: 'dist', // Explicitly set output directory to 'dist'
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
