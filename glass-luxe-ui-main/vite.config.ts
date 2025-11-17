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
      // Explicitly resolve schema dependencies from project's node_modules
      "get-youtube-id": path.resolve(__dirname, "./node_modules/get-youtube-id"),
      "react-lite-youtube-embed": path.resolve(__dirname, "./node_modules/react-lite-youtube-embed"),
    },
    // Ensure Vite can resolve dependencies when processing files outside project root
    preserveSymlinks: false,
    // Force Vite to look in project's node_modules when resolving modules
    // This helps when processing external schema files
    conditions: ['import', 'module', 'browser', 'default'],
    dedupe: [
      "@sanity/icons",
      "@sanity/ui",
      "sanity",
      "@sanity/visual-editing",
      "react",
      "react-dom",
      "react/jsx-runtime",
      "get-youtube-id",
      "react-lite-youtube-embed",
    ],
  },
  build: {
    outDir: "dist",
    sourcemap: mode === "production" ? false : true,
    minify: mode === "production" ? "esbuild" : false,
    rollupOptions: {
      // Don't externalize anything - bundle all dependencies
      // Externalization causes runtime errors in the browser
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-accordion", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
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
      "@sanity/visual-editing",
      "get-youtube-id",
      "react-lite-youtube-embed",
    ],
  },
}));
