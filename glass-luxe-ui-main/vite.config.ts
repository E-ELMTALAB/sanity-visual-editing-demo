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
      "react",
      "react-dom",
      "react/jsx-runtime",
      "get-youtube-id",
      "react-lite-youtube-embed",
      "@sanity/client",
      "@sanity/image-url",
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
      output: {
        // Aggressive chunking to reduce initial bundle size
        manualChunks: (id) => {
          // Sanity client (lightweight) - used by all pages - CHECK FIRST
          if (id.includes('@sanity/client') || id.includes('@sanity/image-url')) {
            return 'vendor-sanity-client';
          }
          // Sanity Studio/Preview (heavy) - separate from lightweight client
          if (id.includes('/sanity/') || id.includes('@sanity/preview-kit') || 
              id.includes('@sanity/ui') || id.includes('@sanity/vision') ||
              id.includes('@sanity/visual-editing') || id.includes('sanity-plugin') ||
              id.includes('@sanity/icons')) {
            return 'vendor-sanity-heavy';
          }
          // Framer motion - separate chunk (used sparingly)
          if (id.includes('framer-motion')) {
            return 'vendor-motion';
          }
          // React core - minimal initial chunk
          if (id.includes('react-dom') || id.includes('react/jsx-runtime') || id.includes('scheduler')) {
            return 'vendor-react';
          }
          // Router
          if (id.includes('react-router')) {
            return 'vendor-router';
          }
          // Radix UI - separate chunk
          if (id.includes('@radix-ui')) {
            return 'vendor-radix';
          }
          // TanStack Query
          if (id.includes('@tanstack')) {
            return 'vendor-query';
          }
          // Lucide icons
          if (id.includes('lucide-react')) {
            return 'vendor-icons';
          }
          // Markdown/rehype/remark
          if (id.includes('remark') || id.includes('rehype') || id.includes('mdast') || id.includes('unified') || id.includes('react-markdown')) {
            return 'vendor-markdown';
          }
          // RxJS (used by Sanity heavy packages)
          if (id.includes('rxjs')) {
            return 'vendor-sanity-heavy';
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
      "@sanity/client",
      "@sanity/image-url",
      "get-youtube-id",
      "react-lite-youtube-embed",
    ],
    // Exclude heavy Sanity packages from optimization
    exclude: [
      "sanity",
      "@sanity/preview-kit",
      "@sanity/visual-editing",
      "@sanity/ui",
      "@sanity/vision",
    ],
  },
}));
