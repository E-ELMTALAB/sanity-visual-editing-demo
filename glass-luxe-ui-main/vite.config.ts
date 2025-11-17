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
    dedupe: [
      "@sanity/icons",
      "@sanity/ui",
      "sanity",
      "react",
      "react-dom",
      "react/jsx-runtime",
    ],
  },
  build: {
    outDir: "dist",
    sourcemap: mode === "production" ? false : true,
    minify: mode === "production" ? "esbuild" : false,
    rollupOptions: {
      // Only externalize Studio-specific packages, NOT packages used by main app
      // Main app needs @sanity/client and @sanity/image-url bundled
      external: (id) => {
        // Don't externalize if it's a relative import or absolute path
        if (id.startsWith('.') || id.startsWith('/')) {
          return false;
        }
        // Only externalize Studio-only packages (not used by main app)
        // Main app packages (@sanity/client, @sanity/image-url) must stay bundled
        if (
          id === 'sanity' || // Studio core
          id.startsWith('sanity-plugin-') || // Studio plugins
          id === '@sanity/icons' || // Only used in schemas/Studio
          id === '@sanity/ui' || // Only used in schemas/Studio
          id === '@sanity/vision' || // Only used in Studio
          id.startsWith('react-lite-') || // Schema-specific
          id.startsWith('get-youtube-') // Schema-specific
        ) {
          return true;
        }
        // Keep @sanity/client, @sanity/image-url, and other @sanity/* packages bundled
        return false;
      },
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
    ],
  },
}));
