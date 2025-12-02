import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { applyCorsHeaders, handleCorsPreflight } from "../../../middleware/global-cors";

/**
 * Store Promotions Proxy (Medusa v2 compatible)
 *
 * GET /store/promotions
 *
 * This route is a thin proxy in front of your Medusa v2 backend. It forwards
 * the request to the upstream Medusa Store API `/store/campaigns` (or any
 * other promotions-related endpoint you configure there) and returns the JSON
 * response as-is.
 *
 * Why this exists:
 * - Medusa v2 does not expose a standard `/store/promotions` endpoint
 * - The frontend wants a stable `/store/promotions` URL that:
 *   - Accepts a *publishable* API key (NOT admin/secret keys)
 *   - Complies with Medusa v2 CORS and security rules
 * - This route never exposes internal or admin keys to the browser
 */

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply CORS headers for store routes
  applyCorsHeaders(req, res);

  // Handle preflight if it somehow comes in as GET (defensive)
  if (handleCorsPreflight(req, res)) {
    return;
  }

  try {
    const backend = process.env.MEDUSA_BACKEND_URL || "https://backend.sharifgpt.com";
    const publishableKey =
      process.env.MEDUSA_PUBLISHABLE_API_KEY ||
      "pk_2243c4f7a1f70eb2bb9b354ad7b22be869fca2633214edd7ee70637412a67bd4";

    const upstreamUrl = `${backend}/store/campaigns`;

    console.log("[STORE/PROMOTIONS] Proxying to upstream:", upstreamUrl);

    const upstreamResponse = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // IMPORTANT: publishable API key header required by Medusa v2 store API
        "x-publishable-api-key": publishableKey,
      },
    });

    console.log(
      "[STORE/PROMOTIONS] Upstream status:",
      upstreamResponse.status,
      upstreamResponse.statusText
    );

    if (!upstreamResponse.ok) {
      const text = await upstreamResponse.text().catch(() => "");
      console.error("[STORE/PROMOTIONS] Upstream error:", upstreamResponse.status, text);

      // Forward a safe error to the client
      return res.status(502).json({
        success: false,
        error: "Failed to fetch promotions from upstream Medusa store API",
        status: upstreamResponse.status,
      });
    }

    const data = await upstreamResponse.json();

    // We don't transform the shape here; the frontend's medusa-promotions.ts
    // already knows how to handle { campaigns: [...] } or { promotions: [...] }.
    console.log("[STORE/PROMOTIONS] Successfully fetched promotions/campaigns");

    return res.status(200).json(data);
  } catch (error: any) {
    console.error("[STORE/PROMOTIONS] Unexpected error:", error?.message || error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Unexpected error while fetching promotions",
    });
  }
};

// Preflight support for CORS
export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(req, res);
  res.status(200).end();
};


