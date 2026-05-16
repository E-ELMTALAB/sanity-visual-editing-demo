import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const PROJECT_ROOT = join(__dirname, "..");

/** Client/static assets output (dist root with @cloudflare/vite-plugin for SPA-only apps) */
export const CLIENT_DIST_DIR = join(PROJECT_ROOT, "dist");
