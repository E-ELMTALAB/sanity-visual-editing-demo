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

     // List all promotions with relations
     let promotions: any[] = [];
     try {
       // Strategy: Always use retrievePromotion for each promotion to ensure relations load
       let promoList: any[] = [];
       
       if (typeof promotionModuleService.listPromotions === 'function') {
         try {
           const result = await promotionModuleService.listPromotions({});
           promoList = Array.isArray(result) ? result : (Array.isArray(result[0]) ? result[0] : []);
           console.log(`[STORE/PROMOTIONS] Listed ${promoList.length} promotions, now retrieving with relations...`);
         } catch (e: any) {
           console.error("[STORE/PROMOTIONS] Error listing promotions:", e.message);
           return res.status(200).json({
             promotions: [],
             campaigns: [],
             count: 0,
             error: process.env.NODE_ENV === "development" ? e.message : undefined,
           });
         }
       } else if (typeof promotionModuleService.list === 'function') {
         const result = await promotionModuleService.list({});
         promoList = Array.isArray(result) ? result : (Array.isArray(result[0]) ? result[0] : []);
       } else {
         console.log("[STORE/PROMOTIONS] ⚠️ Promotion service found but no list method available");
         return res.status(200).json({
           promotions: [],
           campaigns: [],
           count: 0,
           message: "Promotion service found but list method not available"
         });
       }

       // Retrieve each promotion individually with all relations
       if (typeof promotionModuleService.retrievePromotion === 'function') {
         promotions = await Promise.all(
           promoList.map(async (promo: any) => {
             try {
               const fullPromo = await promotionModuleService.retrievePromotion(promo.id, {
                 relations: ['campaign', 'application_method', 'rules'],
               });
               return fullPromo;
             } catch (err: any) {
               console.log(`[STORE/PROMOTIONS] Could not retrieve full details for ${promo.id}:`, err.message);
               // Return the basic promo if retrieval fails
               return promo;
             }
           })
         );
       } else {
         // Fallback: use the list as-is
         promotions = promoList;
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
     
     // Debug: Log first promotion structure with all fields
     if (promotions.length > 0) {
       const samplePromo = promotions[0];
       console.log("[STORE/PROMOTIONS] Sample promotion structure:");
       console.log("  - ID:", samplePromo.id);
       console.log("  - Rules count:", samplePromo.rules?.length || 0);
       if (samplePromo.rules && samplePromo.rules.length > 0) {
         console.log("  - Rules:", JSON.stringify(samplePromo.rules.map((r: any) => ({
           attribute: r.attribute,
           operator: r.operator,
           values: r.values,
         })), null, 2));
       }
       console.log("  - All promotion keys:", Object.keys(samplePromo));
       console.log("  - Campaign keys:", samplePromo.campaign ? Object.keys(samplePromo.campaign) : 'no campaign');
     }

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

     // Helper function to find products matching promotion rules
     const findProductsForPromotion = async (promo: any): Promise<{ product_ids: string[], product_handles: string[], is_site_wide: boolean }> => {
       const productIds: string[] = [];
       const productHandles: string[] = [];

       // Use rules array (buy_rules and target_rules don't exist as separate relations in Medusa v2)
       const allRules = promo.rules || [];

       // Debug: Log all rules
       console.log(`[STORE/PROMOTIONS] Promotion ${promo.id} has ${allRules.length} rules`);
       if (allRules.length > 0) {
         console.log(`[STORE/PROMOTIONS] Rules for ${promo.id}:`, JSON.stringify(allRules.map((r: any) => ({
           attribute: r.attribute,
           operator: r.operator,
           values: r.values,
         })), null, 2));
       }

       // If no rules at all, it's site-wide (applies to all products)
       if (allRules.length === 0) {
         // Check if it targets items (not shipping/order level)
         const targetType = promo.application_method?.target_type;
         if (targetType === 'items' || targetType === 'order' || !targetType) {
           console.log(`[STORE/PROMOTIONS] Promotion ${promo.id} is site-wide (no rules)`);
           return { product_ids: [], product_handles: [], is_site_wide: true }; // Empty arrays + flag means "all products"
         }
         return { product_ids: [], product_handles: [], is_site_wide: false };
       }

       try {
         const productModuleService: any = req.scope.resolve(Modules.PRODUCT);
         
         // Collect all product-related rule values
         const productIdValues: string[] = [];
         const productHandleValues: string[] = [];
         const collectionIds: string[] = [];
         const categoryIds: string[] = [];
         const typeIds: string[] = [];
         const tagValues: string[] = [];

         for (const rule of allRules) {
          const attr = rule.attribute?.toLowerCase() || '';
          const operator = rule.operator?.toLowerCase() || '';
          const values = rule.values || [];

          // Skip if operator is 'ne' or 'nin' (not applicable for product matching)
          if (operator === 'ne' || operator === 'nin') {
            continue;
          }

          // Match product IDs
          if (attr.includes('product.id') || attr === 'id' || attr.includes('product_id')) {
            if (operator === 'eq' || operator === 'in') {
              productIdValues.push(...values);
            }
          }
          
          // Match product handles
          if (attr.includes('product.handle') || attr === 'handle' || attr.includes('product_handle')) {
            if (operator === 'eq' || operator === 'in') {
              productHandleValues.push(...values);
            }
          }
          
          // Match collections
          if (attr.includes('collection') || attr.includes('collection_id')) {
            if (operator === 'eq' || operator === 'in') {
              collectionIds.push(...values);
            }
          }
          
          // Match categories
          if (attr.includes('category') || attr.includes('category_id')) {
            if (operator === 'eq' || operator === 'in') {
              categoryIds.push(...values);
            }
          }
          
          // Match types
          if (attr.includes('type') && !attr.includes('target_type')) {
            if (operator === 'eq' || operator === 'in') {
              typeIds.push(...values);
            }
          }
          
          // Match tags
          if (attr.includes('tag')) {
            if (operator === 'eq' || operator === 'in') {
              tagValues.push(...values);
            }
          }
        }

        // Query products by IDs
        if (productIdValues.length > 0) {
          try {
            const [products] = await productModuleService.listProducts({
              id: productIdValues,
            });
            productIds.push(...(products || []).map((p: any) => p.id));
            productHandles.push(...(products || []).map((p: any) => p.handle).filter(Boolean));
          } catch (e: any) {
            console.log(`[STORE/PROMOTIONS] Error querying products by ID:`, e.message);
          }
        }

        // Query products by handles
        if (productHandleValues.length > 0) {
          try {
            const [products] = await productModuleService.listProducts({
              handle: productHandleValues,
            });
            productIds.push(...(products || []).map((p: any) => p.id));
            productHandles.push(...(products || []).map((p: any) => p.handle).filter(Boolean));
          } catch (e: any) {
            console.log(`[STORE/PROMOTIONS] Error querying products by handle:`, e.message);
          }
        }

        // Query products by collections
        if (collectionIds.length > 0) {
          try {
            const [products] = await productModuleService.listProducts({
              collection_id: collectionIds,
            });
            productIds.push(...(products || []).map((p: any) => p.id));
            productHandles.push(...(products || []).map((p: any) => p.handle).filter(Boolean));
          } catch (e: any) {
            console.log(`[STORE/PROMOTIONS] Error querying products by collection:`, e.message);
          }
        }

        // Query products by categories
        if (categoryIds.length > 0) {
          try {
            const [products] = await productModuleService.listProducts({
              category_id: categoryIds,
            });
            productIds.push(...(products || []).map((p: any) => p.id));
            productHandles.push(...(products || []).map((p: any) => p.handle).filter(Boolean));
          } catch (e: any) {
            console.log(`[STORE/PROMOTIONS] Error querying products by category:`, e.message);
          }
        }

        // Query products by types
        if (typeIds.length > 0) {
          try {
            const [products] = await productModuleService.listProducts({
              type_id: typeIds,
            });
            productIds.push(...(products || []).map((p: any) => p.id));
            productHandles.push(...(products || []).map((p: any) => p.handle).filter(Boolean));
          } catch (e: any) {
            console.log(`[STORE/PROMOTIONS] Error querying products by type:`, e.message);
          }
        }

        // Remove duplicates
        return {
          product_ids: [...new Set(productIds)],
          product_handles: [...new Set(productHandles)],
          is_site_wide: false,
        };
      } catch (error: any) {
        console.log(`[STORE/PROMOTIONS] Error finding products for promotion ${promo.id}:`, error.message);
        return { product_ids: [], product_handles: [], is_site_wide: false };
      }
    };

    // Find products for each promotion
    console.log("[STORE/PROMOTIONS] Finding products for each promotion...");
    const promotionsWithProducts = await Promise.all(
      activePromotions.map(async (promo: any) => {
        const products = await findProductsForPromotion(promo);
        return { ...promo, matched_products: products };
      })
    );

    // Transform promotions to match frontend expectations
    const transformedPromotions = promotionsWithProducts.map((promo: any) => {
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
        // Include matched products
        matched_products: promo.matched_products || { product_ids: [], product_handles: [], is_site_wide: false },
      };
    });

    // Group by campaigns and aggregate products from all promotions in each campaign
    const campaigns = promotionsWithProducts
      .filter((p: any) => p.campaign)
      .reduce((acc: any, promo: any) => {
        const campaignId = promo.campaign.id;
        if (!acc[campaignId]) {
          acc[campaignId] = {
            ...promo.campaign,
            promotions: [],
            matched_products: {
              product_ids: [],
              product_handles: [],
              is_site_wide: false,
            },
          };
        }
        
        // Add promotion to campaign
        const transformedPromo = transformedPromotions.find((tp: any) => tp.id === promo.id);
        acc[campaignId].promotions.push(transformedPromo);
        
        // Aggregate products from this promotion into the campaign
        if (promo.matched_products) {
          // If any promotion in the campaign is site-wide, the campaign is site-wide
          if (promo.matched_products.is_site_wide) {
            acc[campaignId].matched_products.is_site_wide = true;
          }
          
          // Aggregate product IDs and handles (avoid duplicates)
          if (promo.matched_products.product_ids && promo.matched_products.product_ids.length > 0) {
            acc[campaignId].matched_products.product_ids.push(...promo.matched_products.product_ids);
          }
          if (promo.matched_products.product_handles && promo.matched_products.product_handles.length > 0) {
            acc[campaignId].matched_products.product_handles.push(...promo.matched_products.product_handles);
          }
        }
        
        return acc;
      }, {});

    // Remove duplicates from campaign product lists
    Object.values(campaigns).forEach((campaign: any) => {
      if (campaign.matched_products) {
        campaign.matched_products.product_ids = [...new Set(campaign.matched_products.product_ids)];
        campaign.matched_products.product_handles = [...new Set(campaign.matched_products.product_handles)];
      }
    });

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
