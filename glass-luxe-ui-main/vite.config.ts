import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  root: __dirname, // Explicitly set root to ensure proper module resolution
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Ensure Vite can resolve dependencies when processing files outside project root
    preserveSymlinks: false,
    dedupe: ["@sanity/icons", "@sanity/ui", "sanity"],
  },
  build: {
    outDir: "dist",
    sourcemap: mode === "production" ? false : true,
    minify: mode === "production" ? "esbuild" : false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-accordion", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          sanity: ["@sanity/icons", "@sanity/ui", "sanity", "@sanity/vision"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@sanity/icons",
      "@sanity/ui",
      "sanity",
    ],
  },
}));
