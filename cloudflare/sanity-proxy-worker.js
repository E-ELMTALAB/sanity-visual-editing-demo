/**
 * Minimal Cloudflare Worker that proxies GROQ requests for the SharifGPT test project.
 * No environment variables are required – everything is hard-coded for quick testing.
 */

const SANITY_PROJECT_ID = "zrvdkcjy";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2023-06-21";
const SANITY_HOST = "apicdn"; // change to "api" if you need uncached fresh data

export default {
  async fetch(request) {
    const corsHeaders = buildCorsHeaders(request.headers.get("Origin"));

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return jsonResponse({ success: false, error: "Method not allowed" }, corsHeaders, 405);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ success: false, error: "Invalid JSON body" }, corsHeaders, 400);
    }

    const { query, params } = payload ?? {};
    if (typeof query !== "string" || !query.trim()) {
      return jsonResponse({ success: false, error: "Query is required" }, corsHeaders, 400);
    }

    try {
      const groqUrl = buildGroqUrl(query, params);
      const sanityResponse = await fetch(groqUrl, { method: "GET" });
      const responseText = await sanityResponse.text();
      const parsed = safeJson(responseText);

      if (!sanityResponse.ok) {
        return jsonResponse(
          {
            success: false,
            error: parsed?.error || "Sanity query failed",
            status: sanityResponse.status,
            details: parsed ?? responseText,
          },
          corsHeaders,
          sanityResponse.status
        );
      }

      return jsonResponse(
        {
          success: true,
          data: parsed?.result ?? null,
          ms: parsed?.ms ?? null,
        },
        corsHeaders
      );
    } catch (error) {
      return jsonResponse({ success: false, error: error?.message || String(error) }, corsHeaders, 500);
    }
  },
};

function buildGroqUrl(query, params = {}) {
  const url = new URL(
    `https://${SANITY_PROJECT_ID}.${SANITY_HOST}.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`
  );

  url.searchParams.set("query", query);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    }
  });

  return url.toString();
}

function safeJson(payload) {
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function buildCorsHeaders(origin) {
  const allowOrigin = origin || "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
  };
}

function jsonResponse(body, corsHeaders, status = 200) {
  return new Response(JSON.stringify(body, null, 2), { status, headers: corsHeaders });
}

