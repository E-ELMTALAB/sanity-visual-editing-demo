import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const sanityEnv = {
    projectId: env.VITE_SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || "placeholder",
    dataset: env.VITE_SANITY_DATASET || process.env.VITE_SANITY_DATASET || "production",
    apiVersion: env.VITE_SANITY_API_VERSION || process.env.VITE_SANITY_API_VERSION || "2023-06-21",
  };

  console.log("[vite] Sanity env resolved", {
    projectId: sanityEnv.projectId,
    dataset: sanityEnv.dataset,
    apiVersion: sanityEnv.apiVersion,
  });

  return {
  base: "/",
  root: __dirname, // Explicitly set root to ensure proper module resolution
  define: {
    "import.meta.env.VITE_SANITY_PROJECT_ID": JSON.stringify(sanityEnv.projectId),
    "import.meta.env.VITE_SANITY_DATASET": JSON.stringify(sanityEnv.dataset),
    "import.meta.env.VITE_SANITY_API_VERSION": JSON.stringify(sanityEnv.apiVersion),
  },
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
      output: {
        // Manual chunks for better code splitting and caching
        manualChunks: (id) => {
          // Sanity-related code in separate chunk
          if (id.includes('@sanity/') || id.includes('sanity')) {
            return 'sanity';
          }
          // React core in vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
          // Other large vendor libraries
          if (id.includes('node_modules')) {
            // Check for other large dependencies
            if (id.includes('framer-motion') || id.includes('embla-carousel')) {
              return 'vendor-ui';
            }
            return 'vendor';
          }
        },
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
  },
  };
});
