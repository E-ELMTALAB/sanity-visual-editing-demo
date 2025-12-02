import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { applyCorsHeaders, handleCorsPreflight } from "../../../middleware/global-cors";

/**
 * Store Promotions Endpoint (Medusa v2 compatible)
 *
 * GET /store/promotions
 *
 * Returns all active promotions from the Medusa v2 Promotion Module.
 * Filters promotions based on:
 * - Campaign start/end dates
 * - Promotion status
 * - Deleted status
 *
 * This endpoint:
 * - Uses publishable API key authentication (via Medusa v2 middleware)
 * - Returns only active promotions suitable for storefront display
 * - Includes campaign information for countdown timers
 * - Follows Medusa v2 module architecture
 */

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply CORS headers for store routes
  applyCorsHeaders(req, res);

  // Handle preflight requests
  if (handleCorsPreflight(req, res)) {
    return;
  }

  try {
    console.log("[STORE/PROMOTIONS] ========== FETCHING ACTIVE PROMOTIONS ==========");

    // Try to resolve Promotion Module (may not be available if not installed)
    let promotionModuleService: any;
    try {
      // Try different possible module names
      try {
        promotionModuleService = req.scope.resolve(Modules.PROMOTION);
        console.log("[STORE/PROMOTIONS] ✅ Promotion Module found via Modules.PROMOTION");
      } catch (e1: any) {
        // Try alternative: "promotion" as string
        try {
          promotionModuleService = req.scope.resolve("promotionModuleService");
          console.log("[STORE/PROMOTIONS] ✅ Promotion Module found via string resolution");
        } catch (e2: any) {
          // Try alternative: "promotionService"
          promotionModuleService = req.scope.resolve("promotionService");
          console.log("[STORE/PROMOTIONS] ✅ Promotion Module found via promotionService");
        }
      }
    } catch (error: any) {
      console.log("[STORE/PROMOTIONS] ⚠️ Promotion Module not available");
      console.log("[STORE/PROMOTIONS] Error details:", error.message);
      console.log("[STORE/PROMOTIONS] 💡 Tip: Install @medusajs/promotion package to enable promotions");
      
      // Return empty array if promotion module is not installed
      return res.status(200).json({
        promotions: [],
        campaigns: [],
        count: 0,
        message: "Promotion module not configured. Install @medusajs/promotion to enable promotions."
      });
    }

    // List all promotions
    let promotions: any[] = [];
    try {
      if (typeof promotionModuleService.listPromotions === 'function') {
        const result = await promotionModuleService.listPromotions({});
        promotions = Array.isArray(result) ? result : (Array.isArray(result[0]) ? result[0] : []);
      } else if (typeof promotionModuleService.list === 'function') {
        const result = await promotionModuleService.list({});
        promotions = Array.isArray(result) ? result : (Array.isArray(result[0]) ? result[0] : []);
      } else {
        console.log("[STORE/PROMOTIONS] ⚠️ Promotion service found but no list method available");
        return res.status(200).json({
          promotions: [],
          campaigns: [],
          count: 0,
          message: "Promotion service found but list method not available"
        });
      }
    } catch (listError: any) {
      console.error("[STORE/PROMOTIONS] Error listing promotions:", listError.message);
      return res.status(200).json({
        promotions: [],
        campaigns: [],
        count: 0,
        error: process.env.NODE_ENV === "development" ? listError.message : undefined,
      });
    }

    console.log(`[STORE/PROMOTIONS] Found ${promotions.length} total promotions`);

    // Filter for active promotions
    const now = new Date();
    const activePromotions = promotions.filter((promo: any) => {
      // Skip if explicitly inactive or deleted
      if (promo.status === 'inactive' || promo.status === 'expired' || promo.deleted_at) {
        return false;
      }

      // Check campaign dates if available
      if (promo.campaign) {
        const startsAt = promo.campaign.starts_at ? new Date(promo.campaign.starts_at) : null;
        const endsAt = promo.campaign.ends_at ? new Date(promo.campaign.ends_at) : null;

        if (startsAt && now < startsAt) {
          return false; // Not started yet
        }
        if (endsAt && now > endsAt) {
          return false; // Already ended
        }
      }

      // If no campaign, check status or automatic flag
      return promo.status === 'active' || promo.is_automatic;
    });

    console.log(`[STORE/PROMOTIONS] ✅ Active promotions: ${activePromotions.length}`);

    // Transform promotions to match frontend expectations
    const transformedPromotions = activePromotions.map((promo: any) => {
      return {
        id: promo.id,
        code: promo.code || undefined,
        is_automatic: promo.is_automatic || false,
        type: promo.type || 'standard',
        status: promo.status || 'active',
        campaign_id: promo.campaign_id || undefined,
        campaign: promo.campaign ? {
          id: promo.campaign.id,
          name: promo.campaign.name || undefined,
          description: promo.campaign.description || undefined,
          campaign_identifier: promo.campaign.campaign_identifier || undefined,
          starts_at: promo.campaign.starts_at,
          ends_at: promo.campaign.ends_at,
          budget: promo.campaign.budget ? {
            type: promo.campaign.budget.type,
            limit: promo.campaign.budget.limit,
            used: promo.campaign.budget.used,
          } : undefined,
        } : undefined,
        application_method: promo.application_method ? {
          type: promo.application_method.type,
          value: promo.application_method.value,
          target_type: promo.application_method.target_type,
          allocation: promo.application_method.allocation,
          max_quantity: promo.application_method.max_quantity,
          currency_code: promo.application_method.currency_code,
          buy_rules_min_quantity: promo.application_method.buy_rules_min_quantity,
          apply_to_quantity: promo.application_method.apply_to_quantity,
        } : undefined,
        rules: promo.rules ? promo.rules.map((rule: any) => ({
          id: rule.id,
          attribute: rule.attribute,
          operator: rule.operator,
          values: rule.values || [],
          description: rule.description,
        })) : undefined,
        title: promo.title || promo.campaign?.name || undefined,
        description: promo.description || promo.campaign?.description || undefined,
        created_at: promo.created_at,
        updated_at: promo.updated_at,
        deleted_at: promo.deleted_at || null,
      };
    });

    // Group by campaigns for alternative response format
    const campaigns = activePromotions
      .filter((p: any) => p.campaign)
      .reduce((acc: any, promo: any) => {
        const campaignId = promo.campaign.id;
        if (!acc[campaignId]) {
          acc[campaignId] = {
            ...promo.campaign,
            promotions: [],
          };
        }
        acc[campaignId].promotions.push(transformedPromotions.find((tp: any) => tp.id === promo.id));
        return acc;
      }, {});

    console.log(`[STORE/PROMOTIONS] Returning ${transformedPromotions.length} active promotions`);
    console.log(`[STORE/PROMOTIONS] =========================================`);

    // Return in format that frontend can handle
    return res.status(200).json({
      promotions: transformedPromotions,
      campaigns: Object.values(campaigns),
      count: transformedPromotions.length,
    });

  } catch (error: any) {
    console.error("[STORE/PROMOTIONS] ❌ Error fetching promotions:", error);
    console.error("[STORE/PROMOTIONS] Error stack:", error.stack);

    // Return empty array on error (graceful degradation)
    return res.status(200).json({
      promotions: [],
      campaigns: [],
      count: 0,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Preflight support for CORS
export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(req, res);
  res.status(200).end();
};
