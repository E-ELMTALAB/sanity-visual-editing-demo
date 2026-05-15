import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "path";
// https://vitejs.dev/config/
const mode =
  process.env.MODE ?? (process.env.NODE_ENV === "production" ? "production" : "development");
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

const isProduction = mode === "production";

export default defineConfig({
  plugins: [react(), cloudflare()],
  base: "/",
  root: __dirname,
  define: {
    "import.meta.env.VITE_SANITY_PROJECT_ID": JSON.stringify(sanityEnv.projectId),
    "import.meta.env.VITE_SANITY_DATASET": JSON.stringify(sanityEnv.dataset),
    "import.meta.env.VITE_SANITY_API_VERSION": JSON.stringify(sanityEnv.apiVersion),
  },
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "get-youtube-id": path.resolve(__dirname, "./node_modules/get-youtube-id"),
      "react-lite-youtube-embed": path.resolve(__dirname, "./node_modules/react-lite-youtube-embed"),
    },
    preserveSymlinks: false,
    conditions: ["import", "module", "browser", "default"],
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "framer-motion",
      "get-youtube-id",
      "react-lite-youtube-embed",
      "@sanity/client",
      "@sanity/image-url",
      "@sanity/vision",
      "sanity",
    ],
  },
  build: {
    sourcemap: isProduction ? false : true,
    minify: isProduction ? "esbuild" : false,
    cssCodeSplit: true,
    target: "es2020",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("@sanity/") || id.includes("/sanity/") || id.includes("sanity-plugin")) {
            return undefined;
          }
          if (id.includes("node_modules")) return "vendor";
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) return "assets/[name]-[hash][extname]";
          return "assets/[name]-[hash][extname]";
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  assetsInclude: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.webp", "**/*.avif"],
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
});
