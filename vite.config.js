import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// Note: do not add manualChunks for react or other vendors. Splitting React
// into its own chunk breaks it at runtime in the production build. Route-level
// lazy imports in src/App.jsx already keep the editor out of the reader bundle.
export default defineConfig({
  plugins: [react()],
});
