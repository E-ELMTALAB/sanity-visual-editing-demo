# Performance Rescue Playbook

This document summarizes the exact steps we used to move SharifGPT from a **Lighthouse Performance score of ~4 (FCP 12s / LCP 16s / CLS 0.51)** to **84+**. Follow this checklist whenever a future site ships with similar symptoms.

## 1. Baseline & Diagnostics
1. **Run Lighthouse first** (mobile). Capture the failing metrics and the list of flagged resources.
2. **Inspect the devtools console on production builds** (`npm run build && npm run preview`). We saw two critical errors:
   - `Failed to load resource: net::ERR_SSL_PROTOCOL_ERROR` from synchronous GTM/GA.
   - `Uncaught TypeError: Cannot read properties of undefined (reading 'now')` from our customized `vendor-sanity-heavy` chunk.
3. **Compare dev (`npm run dev`) vs build (`npm run preview`)**. Dev mode rendered fine, so the issue came from bundling, not React logic.

## 2. Immediate Rendering Improvements
1. **Inline critical CSS & fonts** (`index.html`, `index.css`).
   - Added inline body styles and gradients.
   - `font-display: optional` + fallback metrics to kill CLS = 0.511.
   - Added static hero markup so the page has content even before Sanity data arrives.
2. **Resource hints**.
   - `<link rel="preconnect" ...>` for CDN/Sanity.
   - `<link rel="preload" ...>` for Vazirmatn font and hero image.
3. **Defer third-party scripts**.
   - Wrapped GA + GTM in `requestIdleCallback` so they no longer block FCP.

## 3. Data & Asset Strategy
1. **Lazy-load Sanity data**.
   - Static hero + trust blocks render immediately.
   - Real content loads via `requestIdleCallback` (after first paint).
2. **Lightweight Sanity client** (`sanity.client.light.ts`).
   - Replaced `@sanity/preview-kit` with plain `@sanity/client` and CDN caching.
   - All page modules now import the light client.
3. **Image optimizations**.
   - Introduced `vite-imagetools` for WebP + responsive sizes.
   - Resized logo to 80×80 WebP and forced Sanity builder to emit WebP (`sanity.image.ts`).

## 4. Animation & JS Cost
1. **Removed heavy framer-motion usage** from the header; replaced with pure CSS animations + `will-change` hints.
2. **Added reduced-motion safeguards** so Lighthouse won’t penalize animation jank.

## 5. Bundler Stability (the biggest fix)
1. We originally forced Rollup into multiple vendor chunks via `manualChunks` and `optimizeDeps.exclude`. That split RxJS + React + Sanity into separate files, creating a circular dependency, which crashed the production bundle.
2. **Resolution**:
   - Deleted the manual chunk rules entirely.
   - Let Vite/Rollup build the dependency graph automatically.
   - Removed the `optimizeDeps.exclude` block; only keep the small `include` list.
   - Rebuilt and verified `vendor-sanity-heavy` disappeared, so the build no longer errors.

## 6. Verification Loop
1. `npm run build` – ensure no warnings.
2. `npm run preview` – open http://localhost:4173, check for console errors, confirm hero renders.
3. Run Lighthouse again (mobile & desktop). Confirm Performance ≥ 80 and CLS ≈ 0.
4. Commit and redeploy.

## 7. Checklist for Future Projects
- [ ] Always test both dev and production builds; preview mode catches bundler issues.
- [ ] Keep Sanity Studio / preview code out of the storefront bundle.
- [ ] Inline critical CSS + fonts, preload hero assets.
- [ ] Lazy-load remote data; render a static skeleton immediately.
- [ ] Defer GTM/GA until `requestIdleCallback` to avoid network blocking.
- [ ] Avoid manual chunk overrides unless you 100% understand dependency cycles.
- [ ] After every major change, re-run Lighthouse and archive screenshots/metrics.

Following these steps took the site from a **score of 4** (FCP 12s, LCP 16s, CLS 0.51) to **84+** with FCP/LCP under 2 seconds. Use this playbook as your starting point for any future performance fire drills