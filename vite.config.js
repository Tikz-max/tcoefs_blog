import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Stable vendor chunks cache well between deployments.
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@tiptap") || id.includes("prosemirror")) return "editor";
            if (id.includes("@supabase")) return "supabase";
            if (id.includes("react-router") || id.includes("react-dom") || id.includes("/react/")) return "react";
          }
          return undefined;
        },
      },
    },
  },
});
