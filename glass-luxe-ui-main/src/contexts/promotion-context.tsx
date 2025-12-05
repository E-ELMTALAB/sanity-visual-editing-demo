import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  type MedusaPromotion,
  type ProductPromotionInfo,
  fetchActivePromotions,
  getBestPromotionForProduct,
  getPrimarySiteWidePromotion,
  clearPromotionsCache,
} from "@/lib/medusa-promotions";

interface PromotionContextType {
  promotions: MedusaPromotion[];
  isLoading: boolean;
  error: string | null;
  getPromotionForProduct: (productSlug: string, productId: string, originalPrice: number) => ProductPromotionInfo | null;
  getSiteWidePromotion: () => MedusaPromotion | null;
  refreshPromotions: () => Promise<void>;
  hasActivePromotions: boolean;
}

const PromotionContext = createContext<PromotionContextType | undefined>(undefined);

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const PromotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promotions, setPromotions] = useState<MedusaPromotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPromotions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const activePromotions = await fetchActivePromotions();
      setPromotions(activePromotions);
      console.log('[PROMOTION-CONTEXT] Loaded', activePromotions.length, 'promotions');
    } catch (err: any) {
      console.error('[PROMOTION-CONTEXT] Error loading promotions:', err);
      setError(err.message || 'Failed to load promotions');
      setPromotions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshPromotions = useCallback(async () => {
    clearPromotionsCache();
    await loadPromotions();
  }, [loadPromotions]);

  // Load promotions on mount
  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);

  // Auto-refresh promotions periodically
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('[PROMOTION-CONTEXT] Auto-refreshing promotions...');
      refreshPromotions();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [refreshPromotions]);

  const getPromotionForProduct = useCallback(
    (productSlug: string, productId: string, originalPrice: number): ProductPromotionInfo | null => {
      if (!promotions.length || originalPrice <= 0) return null;
      return getBestPromotionForProduct(productSlug, productId, originalPrice, promotions);
    },
    [promotions]
  );

  const getSiteWidePromotion = useCallback((): MedusaPromotion | null => {
    if (!promotions.length) return null;
    return getPrimarySiteWidePromotion(promotions);
  }, [promotions]);

  const hasActivePromotions = useMemo(() => promotions.length > 0, [promotions]);

  const value = useMemo(
    () => ({
      promotions,
      isLoading,
      error,
      getPromotionForProduct,
      getSiteWidePromotion,
      refreshPromotions,
      hasActivePromotions,
    }),
    [promotions, isLoading, error, getPromotionForProduct, getSiteWidePromotion, refreshPromotions, hasActivePromotions]
  );

  return (
    <PromotionContext.Provider value={value}>
      {children}
    </PromotionContext.Provider>
  );
};

export const usePromotions = (): PromotionContextType => {
  const context = useContext(PromotionContext);
  if (context === undefined) {
    throw new Error("usePromotions must be used within a PromotionProvider");
  }
  return context;
};

/**
 * Hook to get promotion info for a specific product
 */
export function useProductPromotion(
  productSlug: string | undefined,
  productId: string | undefined,
  originalPrice: number
): ProductPromotionInfo | null {
  const { getPromotionForProduct, isLoading } = usePromotions();

  return useMemo(() => {
    if (isLoading || !productSlug || !productId || originalPrice <= 0) {
      return null;
    }
    return getPromotionForProduct(productSlug, productId, originalPrice);
  }, [getPromotionForProduct, isLoading, productSlug, productId, originalPrice]);
}

/**
 * Hook to get the primary site-wide promotion
 */
export function useSiteWidePromotion(): MedusaPromotion | null {
  const { getSiteWidePromotion, isLoading } = usePromotions();

  return useMemo(() => {
    if (isLoading) return null;
    return getSiteWidePromotion();
  }, [getSiteWidePromotion, isLoading]);
}

export default PromotionContext;


