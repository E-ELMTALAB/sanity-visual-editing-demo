import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  root: __dirname, // Explicitly set root to ensure proper module resolution
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Automatic image optimization at build time
    imagetools({
      defaultDirectives: (url) => {
        // Apply WebP conversion and quality settings to all images
        if (url.pathname.match(/\.(png|jpg|jpeg)$/i)) {
          return new URLSearchParams({
            format: 'webp',
            quality: '80',
          });
        }
        return new URLSearchParams();
      },
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
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
      "@sanity/preview-kit",
      "@sanity/visual-editing",
      "rxjs",
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
    // Enable CSS code splitting for non-blocking CSS
    cssCodeSplit: true,
    // Target modern browsers for smaller bundles
    target: 'es2020',
    rollupOptions: {
      // Don't externalize anything - bundle all dependencies
      // Externalization causes runtime errors in the browser
      output: {
        // Better chunking strategy for performance
        manualChunks: (id) => {
          // Core React ecosystem - loads first
          if (id.includes('react-dom') || id.includes('react/jsx-runtime')) {
            return 'react-core';
          }
          if (id.includes('react-router')) {
            return 'router';
          }
          // Radix UI components - lazy load
          if (id.includes('@radix-ui')) {
            return 'ui-radix';
          }
          // Sanity - only needed for CMS features
          if (id.includes('@sanity') || id.includes('sanity')) {
            return 'sanity';
          }
          // Framer motion - animations
          if (id.includes('framer-motion')) {
            return 'motion';
          }
          // Query client
          if (id.includes('@tanstack')) {
            return 'query';
          }
        },
        // Ensure CSS is extracted properly
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  // Optimize images during build
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp', '**/*.avif'],
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@sanity/icons",
      "@sanity/ui",
      "sanity",
      "@sanity/preview-kit",
      "@sanity/visual-editing",
      "rxjs",
      "get-youtube-id",
      "react-lite-youtube-embed",
    ],
  },
}));
