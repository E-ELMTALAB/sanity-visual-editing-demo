/**
 * Medusa v2 Promotions API Layer
 * 
 * IMPORTANT: Medusa v2 handles promotions differently than v1:
 * - Promotions are NOT exposed via a standard Store API endpoint
 * - Promotions are applied at the cart level when items are added
 * - Product pricing may include calculated_price fields when promotions apply
 * 
 * This module provides:
 * 1. Support for custom /store/promotions endpoint (if implemented on your backend)
 * 2. Utility functions for promotion display and calculations
 * 3. Integration with Medusa's calculated pricing system
 * 
 * To use promotions with Medusa v2, you need to:
 * 1. Create promotions in Medusa Admin with campaigns (start/end dates)
 * 2. Optionally expose a custom /store/promotions endpoint on your backend
 * 3. Or rely on calculated_price in product variants for automatic discounts
 */

import { getMedusaBackendUrl, MEDUSA_PUBLISHABLE_KEY } from './proxy.config'

// Get backend URL through proxy when enabled
const getBackendUrl = () => getMedusaBackendUrl();
const getPublishableKey = () => import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || MEDUSA_PUBLISHABLE_KEY;

// ============ TYPES (Aligned with Medusa v2 Promotion Module) ============

/**
 * Campaign structure in Medusa v2
 * Campaigns group promotions and define their active period
 */
export interface PromotionCampaign {
  id: string;
  name?: string;
  description?: string;
  campaign_identifier?: string;
  starts_at: string;  // ISO date string
  ends_at: string;    // ISO date string
  budget?: {
    type?: 'spend' | 'usage';
    limit?: number;
    used?: number;
  };
}

/**
 * Application method defines how the promotion discount is applied
 * Aligned with Medusa v2's ApplicationMethodDTO
 */
export interface PromotionApplicationMethod {
  type: 'percentage' | 'fixed';
  value: number;  // For percentage: 10 = 10%, For fixed: amount in smallest currency unit
  target_type: 'items' | 'shipping' | 'order';
  allocation?: 'each' | 'across';
  max_quantity?: number;
  currency_code?: string;
  // Medusa v2 specific fields
  buy_rules_min_quantity?: number;
  apply_to_quantity?: number;
}

/**
 * Promotion rules define conditions for when a promotion applies
 * Aligned with Medusa v2's PromotionRuleDTO
 */
export interface PromotionRule {
  id?: string;
  attribute: string;  // e.g., 'items.product.id', 'items.product.handle', 'customer.groups.id'
  operator: 'eq' | 'ne' | 'in' | 'nin' | 'gt' | 'gte' | 'lt' | 'lte';
  values: string[];
  description?: string;
}

/**
 * Matched products structure from backend
 * This tells us which products are associated with a promotion
 */
export interface MatchedProducts {
  product_ids: string[];
  product_handles: string[];
  is_site_wide: boolean;
}

/**
 * Main promotion structure aligned with Medusa v2's PromotionDTO
 */
export interface MedusaPromotion {
  id: string;
  code?: string;
  is_automatic: boolean;
  type: 'standard' | 'buyget';
  status?: 'active' | 'inactive' | 'expired' | 'draft';
  campaign_id?: string;
  campaign?: PromotionCampaign;
  application_method?: PromotionApplicationMethod;
  rules?: PromotionRule[];
  // Backend-provided matched products (from /store/promotions endpoint)
  matched_products?: MatchedProducts;
  // Display fields (may be custom)
  title?: string;
  description?: string;
  // Medusa v2 timestamps
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

/**
 * Computed promotion info for a specific product
 */
export interface ProductPromotionInfo {
  promotion: MedusaPromotion;
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  discountPercentage: number;
  endsAt?: string;  // ISO date string
}

// ============ CACHE ============

const PROMOTIONS_CACHE_KEY = 'medusa-promotions-cache-v2';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

interface PromotionsCacheEntry {
  data: MedusaPromotion[];
  timestamp: number;
}

function getCachedPromotions(): MedusaPromotion[] | null {
  try {
    const cached = localStorage.getItem(PROMOTIONS_CACHE_KEY);
    if (!cached) return null;

    const cache: PromotionsCacheEntry = JSON.parse(cached);

    // Check if cache is expired
    if (Date.now() - cache.timestamp > CACHE_DURATION) {
      localStorage.removeItem(PROMOTIONS_CACHE_KEY);
      return null;
    }

    console.log('[MEDUSA-PROMOTIONS] Using cached promotions:', cache.data.length, 'promotions');
    return cache.data;
  } catch (error) {
    console.warn('[MEDUSA-PROMOTIONS] Cache read error:', error);
    return null;
  }
}

function setCachedPromotions(data: MedusaPromotion[]): void {
  try {
    const cache: PromotionsCacheEntry = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(PROMOTIONS_CACHE_KEY, JSON.stringify(cache));
    console.log('[MEDUSA-PROMOTIONS] Cached', data.length, 'promotions');
  } catch (error) {
    console.warn('[MEDUSA-PROMOTIONS] Cache write error:', error);
  }
}

export function clearPromotionsCache(): void {
  localStorage.removeItem(PROMOTIONS_CACHE_KEY);
  console.log('[MEDUSA-PROMOTIONS] Cache cleared');
}

// ============ API FUNCTIONS ============

/**
 * Fetch all active promotions from Medusa backend
 * Routes through Cloudflare proxy when enabled for Iran filtering bypass
 * 
 * NOTE: Medusa v2 does NOT have a standard /store/promotions endpoint.
 * This function expects a CUSTOM endpoint to be implemented on your backend.
 * 
 * If you haven't implemented a custom endpoint, this will gracefully return
 * an empty array and your promotions will be handled via:
 * 1. Cart-level promotion codes
 * 2. Automatic promotions applied to calculated_price in variants
 * 
 * To implement a custom endpoint on your Medusa backend, create:
 * src/api/store/promotions/route.ts
 */
export async function fetchActivePromotions(): Promise<MedusaPromotion[]> {
  const backendUrl = getBackendUrl();
  
  console.log('[MEDUSA-PROMOTIONS] ========== FETCHING ACTIVE PROMOTIONS ==========');
  console.log('[MEDUSA-PROMOTIONS] Backend URL:', backendUrl);

  // Check cache first
  const cachedPromotions = getCachedPromotions();
  if (cachedPromotions) {
    return cachedPromotions;
  }

  // Try custom store endpoint (must be implemented on your Medusa backend)
  // This is NOT a standard Medusa v2 endpoint
  const endpoints = [
    '/store/promotions',           // Custom endpoint (recommended)
    '/store/campaigns',            // Alternative: fetch campaigns with promotions
  ];

  for (const endpoint of endpoints) {
    try {
      console.log('[MEDUSA-PROMOTIONS] Trying endpoint:', endpoint);
      
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': getPublishableKey(),
        },
      });

      console.log('[MEDUSA-PROMOTIONS] Response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('[MEDUSA-PROMOTIONS] Endpoint not implemented:', endpoint);
        } else {
          console.warn('[MEDUSA-PROMOTIONS] Endpoint error:', endpoint, response.status);
        }
        continue; // Try next endpoint
      }

      const result = await response.json();
      console.log('[MEDUSA-PROMOTIONS] Raw response from', endpoint);

      // Handle different response formats
      let promotions: MedusaPromotion[] = [];
      
      if (Array.isArray(result)) {
        promotions = result;
      } else if (result.promotions && Array.isArray(result.promotions)) {
        promotions = result.promotions;
      } else if (result.campaigns && Array.isArray(result.campaigns)) {
        // Extract promotions from campaigns
        promotions = result.campaigns.flatMap((c: any) => c.promotions || []);
      } else if (result.data && Array.isArray(result.data)) {
        promotions = result.data;
      }

      if (promotions.length === 0) {
        console.log('[MEDUSA-PROMOTIONS] No promotions found at', endpoint);
        continue; // Try next endpoint
      }

      // Filter to only active promotions with valid campaigns
      const now = new Date();
      const activePromotions = promotions.filter(promo => {
        // Skip if explicitly inactive or deleted
        if (promo.status === 'inactive' || promo.status === 'expired' || promo.deleted_at) {
          return false;
        }
        
        // Check campaign dates if available
        if (promo.campaign) {
          const startsAt = new Date(promo.campaign.starts_at);
          const endsAt = new Date(promo.campaign.ends_at);
          return now >= startsAt && now <= endsAt;
        }
        
        // If no campaign, check status or automatic flag
        return promo.status === 'active' || promo.is_automatic;
      });

      console.log('[MEDUSA-PROMOTIONS] Active promotions:', activePromotions.length);
      
      // Cache the results
      setCachedPromotions(activePromotions);

      console.log('[MEDUSA-PROMOTIONS] =========================================');
      return activePromotions;

    } catch (error: any) {
      console.warn('[MEDUSA-PROMOTIONS] Error with endpoint', endpoint, ':', error.message);
      continue; // Try next endpoint
    }
  }

  // No promotions found from any endpoint
  console.log('[MEDUSA-PROMOTIONS] No custom promotions endpoint available');
  console.log('[MEDUSA-PROMOTIONS] Tip: Promotions will be applied via cart or calculated_price');
  console.log('[MEDUSA-PROMOTIONS] =========================================');
  
  // Cache empty result to avoid repeated failed requests
  setCachedPromotions([]);
  return [];
}

/**
 * Get promotions that apply to a specific product
 * 
 * Priority order:
 * 1. Use matched_products from backend (most reliable)
 * 2. Fall back to parsing rules if matched_products not available
 */
export function getPromotionsForProduct(
  productSlug: string,
  productId: string,
  promotions: MedusaPromotion[]
): MedusaPromotion[] {
  if (!promotions.length) return [];

  return promotions.filter(promo => {
    // Priority 1: Use matched_products from backend (most reliable)
    if (promo.matched_products) {
      const { product_ids, product_handles, is_site_wide } = promo.matched_products;
      
      // Site-wide promotions apply to all products
      if (is_site_wide) {
        // Check if it targets items (not shipping/order level)
        const targetType = promo.application_method?.target_type;
        return targetType === 'items' || targetType === 'order' || !targetType;
      }
      
      // Check if this product matches by ID or handle
      const matchesById = product_ids.length > 0 && product_ids.includes(productId);
      const matchesByHandle = product_handles.length > 0 && productSlug && product_handles.includes(productSlug);
      
      return matchesById || matchesByHandle;
    }
    
    // Priority 2: Fall back to parsing rules (legacy support)
    // If no rules, it's a site-wide promotion (applies to all products)
    if (!promo.rules || promo.rules.length === 0) {
      // But check if it targets items (not shipping/order level)
      const targetType = promo.application_method?.target_type;
      return targetType === 'items' || targetType === 'order' || !targetType;
    }

    // Check if product matches any rule
    // Medusa v2 uses dot notation for nested attributes
    return promo.rules.some(rule => {
      const attr = rule.attribute.toLowerCase();
      
      // Handle various attribute formats
      if (attr.includes('product.handle') || attr.includes('product_handle') || attr === 'handle') {
        return matchesRule(productSlug, rule);
      }
      
      if (attr.includes('product.id') || attr.includes('product_id') || attr === 'id') {
        return matchesRule(productId, rule);
      }
      
      return false;
    });
  });
}

/**
 * Helper function to check if a value matches a rule
 */
function matchesRule(value: string, rule: PromotionRule): boolean {
  const values = rule.values.map(v => v.toLowerCase());
  const normalizedValue = value.toLowerCase();
  
  switch (rule.operator) {
    case 'eq':
      return values.length === 1 && values[0] === normalizedValue;
    case 'ne':
      return values.length === 1 && values[0] !== normalizedValue;
    case 'in':
      return values.includes(normalizedValue);
    case 'nin':
      return !values.includes(normalizedValue);
    default:
      return false;
  }
}

/**
 * Get the best (highest discount) promotion for a product
 */
export function getBestPromotionForProduct(
  productSlug: string,
  productId: string,
  originalPrice: number,
  promotions: MedusaPromotion[]
): ProductPromotionInfo | null {
  if (originalPrice <= 0) return null;
  
  const applicablePromotions = getPromotionsForProduct(productSlug, productId, promotions);
  
  if (applicablePromotions.length === 0) {
    console.log(`[PROMOTIONS] No applicable promotions for product ${productSlug} (ID: ${productId})`);
    return null;
  }

  console.log(`[PROMOTIONS] Found ${applicablePromotions.length} applicable promotion(s) for product ${productSlug}`);

  // Calculate discount for each promotion and find the best one
  let bestPromo: ProductPromotionInfo | null = null;

  for (const promo of applicablePromotions) {
    if (!promo.application_method) {
      console.log(`[PROMOTIONS] Promotion ${promo.id} has no application_method, skipping`);
      continue;
    }
    
    const discountedPrice = calculateDiscountedPrice(originalPrice, promo);
    const discountAmount = originalPrice - discountedPrice;
    
    // Skip if no actual discount
    if (discountAmount <= 0) {
      console.log(`[PROMOTIONS] Promotion ${promo.id} results in no discount, skipping`);
      continue;
    }
    
    const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

    console.log(`[PROMOTIONS] Promotion ${promo.id}: ${discountPercentage}% discount (${originalPrice} -> ${discountedPrice})`);

    // Extract end date from campaign, with comprehensive logging and fallback logic
    let endsAt: string | undefined = undefined;
    if (promo.campaign) {
      endsAt = promo.campaign.ends_at;
      
      if (!endsAt) {
        console.warn(`[PROMOTIONS] Promotion ${promo.id} has campaign ${promo.campaign.id} but ends_at is missing!`);
        // Fallback: Try to find the campaign's ends_at from another promotion in the same campaign
        const campaignId = promo.campaign.id || promo.campaign_id;
        if (campaignId) {
          const otherPromoWithCampaign = promotions.find(p => 
            p.id !== promo.id && // Don't match the current promotion
            (p.campaign?.id === campaignId || p.campaign_id === campaignId) && 
            p.campaign?.ends_at
          );
          if (otherPromoWithCampaign?.campaign?.ends_at) {
            endsAt = otherPromoWithCampaign.campaign.ends_at;
            console.log(`[PROMOTIONS] Found ends_at from another promotion in same campaign (${campaignId}): ${endsAt}`);
          }
        }
      }
      
      if (endsAt) {
        console.log(`[PROMOTIONS] Promotion ${promo.id} has valid ends_at: ${endsAt}`);
      }
    } else {
      console.log(`[PROMOTIONS] Promotion ${promo.id} has no campaign object`);
      if (promo.campaign_id) {
        console.warn(`[PROMOTIONS] Promotion ${promo.id} has campaign_id (${promo.campaign_id}) but campaign object is missing!`);
        // Fallback: Try to find the campaign from another promotion with the same campaign_id
        const otherPromoWithCampaign = promotions.find(p => 
          p.id !== promo.id && // Don't match the current promotion
          (p.campaign_id === promo.campaign_id || p.campaign?.id === promo.campaign_id) && 
          p.campaign?.ends_at
        );
        if (otherPromoWithCampaign?.campaign?.ends_at) {
          endsAt = otherPromoWithCampaign.campaign.ends_at;
          console.log(`[PROMOTIONS] Found ends_at from another promotion with same campaign_id (${promo.campaign_id}): ${endsAt}`);
        }
      }
    }

    if (!bestPromo || discountAmount > bestPromo.discountAmount) {
      bestPromo = {
        promotion: promo,
        originalPrice,
        discountedPrice,
        discountAmount,
        discountPercentage,
        endsAt: endsAt,
      };
    }
  }

  // Final fallback: If bestPromo doesn't have endsAt, try to get it from site-wide promotion
  if (bestPromo && !bestPromo.endsAt) {
    const siteWidePromo = getPrimarySiteWidePromotion(promotions);
    if (siteWidePromo?.campaign?.ends_at) {
      bestPromo.endsAt = siteWidePromo.campaign.ends_at;
      console.log(`[PROMOTIONS] Using site-wide promotion ends_at as fallback: ${bestPromo.endsAt}`);
    }
  }

  if (bestPromo) {
    console.log(`[PROMOTIONS] Best promotion for ${productSlug}: ${bestPromo.discountPercentage}% discount, ends at ${bestPromo.endsAt || 'undefined'}`);
  }

  return bestPromo;
}

/**
 * Get site-wide promotions (no product-specific rules)
 */
export function getSiteWidePromotions(promotions: MedusaPromotion[]): MedusaPromotion[] {
  return promotions.filter(promo => {
    // Priority 1: Use matched_products from backend
    if (promo.matched_products) {
      return promo.matched_products.is_site_wide;
    }
    
    // Priority 2: Fall back to checking rules
    // Site-wide if no rules
    if (!promo.rules || promo.rules.length === 0) {
      return true;
    }
    
    // Or if it targets order level
    if (promo.application_method?.target_type === 'order') {
      return true;
    }
    
    // Check if rules are customer-based (not product-based)
    const hasOnlyCustomerRules = promo.rules.every(rule => {
      const attr = rule.attribute.toLowerCase();
      return attr.includes('customer') || attr.includes('group');
    });
    
    return hasOnlyCustomerRules;
  });
}

/**
 * Get the most prominent site-wide promotion (for hero banner)
 */
export function getPrimarySiteWidePromotion(promotions: MedusaPromotion[]): MedusaPromotion | null {
  const siteWide = getSiteWidePromotions(promotions);
  if (siteWide.length === 0) return null;

  // Sort by discount value (highest first), then by end date (soonest first)
  return siteWide.sort((a, b) => {
    const valueA = a.application_method?.value || 0;
    const valueB = b.application_method?.value || 0;
    
    if (valueB !== valueA) {
      return valueB - valueA;
    }
    
    // If same value, prefer the one ending sooner (more urgent)
    const endA = a.campaign?.ends_at ? new Date(a.campaign.ends_at).getTime() : Infinity;
    const endB = b.campaign?.ends_at ? new Date(b.campaign.ends_at).getTime() : Infinity;
    return endA - endB;
  })[0];
}

/**
 * Calculate discounted price based on promotion
 * Handles both percentage and fixed amount discounts
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  promotion: MedusaPromotion
): number {
  if (!promotion.application_method) return originalPrice;
  
  const { type, value } = promotion.application_method;

  if (type === 'percentage') {
    // value is percentage (e.g., 10 = 10%)
    const discount = originalPrice * (value / 100);
    return Math.round(originalPrice - discount);
  }

  if (type === 'fixed') {
    // In Medusa v2, fixed amounts are in the smallest currency unit
    // For IRR (Rials), we need to convert to Tomans
    // If value > 100000, assume it's in Rials and convert
    const discountAmount = value > 100000 ? Math.round(value / 10) : value;
    return Math.max(0, originalPrice - discountAmount);
  }

  return originalPrice;
}

/**
 * Calculate time remaining until promotion ends
 */
export function getTimeRemaining(endsAt: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  expired: boolean;
} {
  if (!endsAt) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, expired: true };
  }

  try {
    const now = new Date().getTime();
    const end = new Date(endsAt).getTime();
    
    // Check if date is valid
    if (isNaN(end)) {
      console.warn('[getTimeRemaining] Invalid date:', endsAt);
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, expired: true };
    }

    const total = end - now;

    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, expired: true };
    }

    return {
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((total % (1000 * 60)) / 1000),
      total,
      expired: false,
    };
  } catch (error) {
    console.error('[getTimeRemaining] Error calculating time remaining:', error, endsAt);
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, expired: true };
  }
}

/**
 * Format number to Persian digits
 */
export function toPersianNumber(num: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

/**
 * Format number with thousands separator in Persian locale
 */
export function formatPersianPrice(num: number): string {
  return num.toLocaleString('fa-IR');
}

/**
 * Check if a promotion is currently active
 */
export function isPromotionActive(promotion: MedusaPromotion): boolean {
  // Check status
  if (promotion.status === 'inactive' || promotion.status === 'expired' || promotion.deleted_at) {
    return false;
  }
  
  // Check campaign dates
  if (promotion.campaign) {
    const now = new Date();
    const startsAt = new Date(promotion.campaign.starts_at);
    const endsAt = new Date(promotion.campaign.ends_at);
    return now >= startsAt && now <= endsAt;
  }
  
  // If no campaign, rely on status or automatic flag
  return promotion.status === 'active' || promotion.is_automatic;
}

/**
 * Get formatted discount label for display
 */
export function getDiscountLabel(promotion: MedusaPromotion): string {
  if (!promotion.application_method) {
    return 'تخفیف ویژه';
  }
  
  const { type, value } = promotion.application_method;

  if (type === 'percentage') {
    return `${toPersianNumber(value)}٪ تخفیف`;
  }

  if (type === 'fixed') {
    // Convert from smallest unit if needed
    const displayValue = value > 100000 ? Math.round(value / 10) : value;
    return `${formatPersianPrice(displayValue)} تومان تخفیف`;
  }

  return 'تخفیف ویژه';
}

/**
 * Get promotion code if available (for display/copy)
 */
export function getPromotionCode(promotion: MedusaPromotion): string | null {
  if (promotion.is_automatic) {
    return null; // Automatic promotions don't have codes
  }
  return promotion.code || null;
}
