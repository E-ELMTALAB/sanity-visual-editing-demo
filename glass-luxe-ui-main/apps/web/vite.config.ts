import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
    plugins: [
      react(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
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
      ],
    },
    build: {
      outDir: "dist",
      sourcemap: mode === "production" ? false : true,
      minify: mode === "production" ? "esbuild" : false,
      cssCodeSplit: true,
      target: "es2020",
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("@sanity/") || id.includes("sanity")) return "sanity";
            if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) return "vendor";
            if (id.includes("node_modules")) {
              if (id.includes("framer-motion") || id.includes("embla-carousel")) return "vendor-ui";
              return "vendor";
            }
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
  };
});
