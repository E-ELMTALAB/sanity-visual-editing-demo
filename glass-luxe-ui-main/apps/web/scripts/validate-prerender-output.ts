import { access, readFile, writeFile, mkdir } from "fs/promises";
import { constants } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");
const DIST_DIR = join(PROJECT_ROOT, "dist");
const MANIFEST_PATH = join(PROJECT_ROOT, "src/data/prerender/routes.json");
const REPORT_PATH = join(PROJECT_ROOT, "src/data/prerender/validation-report.json");

type Manifest = { routes: string[] };

function routeToFile(route: string): string {
  if (route === "/") return join(DIST_DIR, "index.html");
  return join(DIST_DIR, route.replace(/^\/+/, ""), "index.html");
}

function hasTag(html: string, regex: RegExp): boolean {
  return regex.test(html);
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const manifestContent = await readFile(MANIFEST_PATH, "utf-8");
  const manifest = JSON.parse(manifestContent) as Manifest;
  const routes = Array.isArray(manifest.routes) ? manifest.routes : [];

  const sampleRoutes = [
    "/",
    "/products",
    "/blog",
    ...routes.filter((r) => r.startsWith("/products/")).slice(0, 1),
    ...routes.filter((r) => r.startsWith("/blog/")).slice(0, 1),
    ...routes.filter((r) => r.startsWith("/collections/")).slice(0, 1),
  ];

  const uniqueSamples = Array.from(new Set(sampleRoutes));
  const checks: Array<{
    route: string;
    file: string;
    exists: boolean;
    hasTitle: boolean;
    hasDescription: boolean;
    hasCanonical: boolean;
    hasRootContent: boolean;
  }> = [];

  for (const route of uniqueSamples) {
    const file = routeToFile(route);
    const fileExists = await exists(file);
    if (!fileExists) {
      checks.push({
        route,
        file,
        exists: false,
        hasTitle: false,
        hasDescription: false,
        hasCanonical: false,
        hasRootContent: false,
      });
      continue;
    }

    const html = await readFile(file, "utf-8");
    const hasTitle = hasTag(html, /<title>[\s\S]*?<\/title>/i);
    const hasDescription = hasTag(html, /<meta\s+name=["']description["'][^>]*>/i);
    const hasCanonical = hasTag(html, /<link\s+rel=["']canonical["'][^>]*>/i);
    const hasRootContent = hasTag(html, /<div\s+id=["']root["'][^>]*>[\s\S]*\S[\s\S]*<\/div>/i);

    checks.push({
      route,
      file,
      exists: true,
      hasTitle,
      hasDescription,
      hasCanonical,
      hasRootContent,
    });
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    totalChecks: checks.length,
    passed: checks.filter((c) => c.exists && c.hasTitle && c.hasDescription && c.hasCanonical && c.hasRootContent)
      .length,
    failed: checks.filter((c) => !(c.exists && c.hasTitle && c.hasDescription && c.hasCanonical && c.hasRootContent))
      .length,
    checks,
    lighthouseNextStep: [
      "Run Lighthouse on / and one prerendered /products/:slug route.",
      "Compare LCP before/after prerender rollout in the same network/device profile.",
    ],
  };

  await mkdir(dirname(REPORT_PATH), { recursive: true });
  await writeFile(REPORT_PATH, JSON.stringify(summary, null, 2), "utf-8");

  console.log("[validate-prerender] Report:", REPORT_PATH);
  console.log(
    "[validate-prerender] Passed:",
    summary.passed,
    "Failed:",
    summary.failed,
    "Total:",
    summary.totalChecks,
  );

  if (summary.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("[validate-prerender] Failed:", error);
  process.exit(1);
});


