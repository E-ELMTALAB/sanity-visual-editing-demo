# LCP Performance Experiments Guide

## Overview
This guide explains how to run the 3 A/B experiments to identify the true LCP bottleneck.

## Instrumentation
All experiments include comprehensive instrumentation that logs:
- `heroSrcSetTime`: When hero image src is set
- `heroInDOMTime`: When hero img element is in DOM
- `heroVisibleTime`: When hero img becomes visible (getBoundingClientRect + computedStyle)
- `heroLoadTime`: When hero img finishes loading
- `lcpTime`: LCP timestamp from PerformanceObserver
- `lcpElement`: LCP element (tagName + selector)
- `lcpUrl`: LCP resource URL
- `timeFromReactMount`: LCP time relative to React mount
- `timeFromHeroVisible`: LCP time relative to hero visibility

## Running Experiments

### Baseline (Current Setup)
```bash
# No env var needed - this is the default
npm run build
npm run preview
# Or: npm run dev
```

### Experiment A: Static Hero (No Sanity Fetch)
```bash
VITE_EXPERIMENT=A npm run build
VITE_EXPERIMENT=A npm run preview
```

**What it does:**
- Hero image src is hardcoded to `/assets/hero-ai-cubes.png` immediately
- No Sanity API call
- Hero image renders as soon as React mounts

**Expected console logs:**
- `[EXPERIMENT A] Using static hero (no Sanity fetch)`
- `[LCP INSTRUMENT] heroSlide state SET (heroSrcSetTime): <timestamp> ms`
- No Sanity fetch logs

### Experiment B: Gradient Only (No Image)
```bash
VITE_EXPERIMENT=B npm run build
VITE_EXPERIMENT=B npm run preview
```

**What it does:**
- Removes hero image completely (gradient background only)
- Removes PromoBanner (to prevent LCP swap)
- Removes TrustBadges (to prevent LCP swap)
- Minimal above-fold content

**Expected console logs:**
- `[EXPERIMENT B] Gradient only (no hero image)`
- No hero image logs (img element not rendered)

### Experiment C: Pre-React Hero in HTML
```bash
VITE_EXPERIMENT=C npm run build
VITE_EXPERIMENT=C npm run preview
```

**What it does:**
- Hero image rendered in `index.html` BEFORE `#root`
- Prehero stays visible for 5+ seconds (or until user interaction)
- React mounts normally but doesn't remove prehero immediately
- LCP should be captured from static HTML hero

**Expected console logs:**
- `[EXPERIMENT C] Keeping prehero visible for 5+ seconds`
- Prehero img has `data-lcp-hero="true"` attribute
- Prehero removed after 5s or user interaction

## Testing Procedure

For each experiment:

1. **Build and start server:**
   ```bash
   VITE_EXPERIMENT=<A|B|C> npm run build
   VITE_EXPERIMENT=<A|B|C> npm run preview
   ```

2. **Run Lighthouse Mobile 5 times:**
   - Open Chrome DevTools > Lighthouse
   - Select "Mobile" device
   - Select "Slow 4G" throttling
   - Select "4x CPU slowdown"
   - Click "Analyze page load"
   - Repeat 5 times

3. **Record median values:**
   - Performance score
   - LCP (Largest Contentful Paint)
   - FCP (First Contentful Paint)
   - Speed Index

4. **Check console logs:**
   - Open DevTools Console
   - Look for `[LCP INSTRUMENT]` logs
   - Record:
     - `heroSrcSetTime`
     - `heroInDOMTime`
     - `heroVisibleTime`
     - `heroLoadTime`
     - `lcpTime`
     - `lcpElement` (tagName + selector)
     - `lcpUrl`
     - `timeFromReactMount`
     - `timeFromHeroVisible`

5. **Document LCP element:**
   - From PerformanceObserver logs, note:
     - Element tagName (IMG, DIV, etc.)
     - Element selector (id, class, or tag)
     - LCP URL (if image)
     - LCP startTime

## Results Template

### Baseline
- Median Performance: ___
- Median LCP: ___
- Median FCP: ___
- Median Speed Index: ___
- LCP Element: ___
- LCP URL: ___
- heroSrcSetTime: ___
- heroInDOMTime: ___
- heroVisibleTime: ___
- heroLoadTime: ___
- timeFromReactMount: ___

### Experiment A (Static Hero)
- Median Performance: ___
- Median LCP: ___
- Median FCP: ___
- Median Speed Index: ___
- LCP Element: ___
- LCP URL: ___
- heroSrcSetTime: ___
- heroInDOMTime: ___
- heroVisibleTime: ___
- heroLoadTime: ___
- timeFromReactMount: ___
- **Verdict:** Sanity [IS/IS NOT] gating LCP

### Experiment B (Gradient Only)
- Median Performance: ___
- Median LCP: ___
- Median FCP: ___
- Median Speed Index: ___
- LCP Element: ___
- heroSrcSetTime: N/A (no image)
- heroInDOMTime: N/A
- heroVisibleTime: N/A
- heroLoadTime: N/A
- timeFromReactMount: ___
- **Verdict:** Image [IS/IS NOT] the bottleneck

### Experiment C (Pre-React Hero)
- Median Performance: ___
- Median LCP: ___
- Median FCP: ___
- Median Speed Index: ___
- LCP Element: ___
- LCP URL: ___
- **Verdict:** React mount [IS/IS NOT] gating LCP

## Final Verdict

After running all experiments, answer:

1. **Is LCP < 3.5s feasible SPA-only?** [YES/NO]
   - Based on Experiment A/B results

2. **Minimal removals to reach Performance >= 90:**
   - List prioritized changes with file/line references

3. **If not feasible:**
   - Smallest architecture change (index.html prehero OR prerender) that guarantees 90

## Notes

- All experiments use the same instrumentation code
- Console logs are prefixed with `[LCP INSTRUMENT]` or `[EXPERIMENT X]`
- LCP element is tracked via `data-lcp-hero` attribute
- Visibility is checked using `getBoundingClientRect()` + `getComputedStyle()`

