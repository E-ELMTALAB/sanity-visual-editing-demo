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
      // Externalize only Sanity packages when processing schema files from parent directory
      // React must remain bundled for the main app to work
      // The Studio will load Sanity packages from node_modules at runtime
      external: (id) => {
        // Don't externalize if it's a relative import or absolute path
        if (id.startsWith('.') || id.startsWith('/')) {
          return false;
        }
        // Only externalize Sanity packages - React must stay bundled
        if (
          id.startsWith('@sanity/') ||
          id === 'sanity' ||
          id.startsWith('sanity-plugin-')
        ) {
          return true;
        }
        // Externalize other schema dependencies that aren't needed by main app
        if (
          id.startsWith('react-lite-') ||
          id.startsWith('get-youtube-')
        ) {
          return true;
        }
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
