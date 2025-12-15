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

  // Defer loading promotions until user interaction to keep initial network chain clean
  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;
    let triggered = false;

    const startPromotions = async () => {
      if (triggered || cancelled) return;
      triggered = true;
      window.removeEventListener("scroll", startPromotions);
      window.removeEventListener("pointerdown", startPromotions);
      window.removeEventListener("keydown", startPromotions);
      await loadPromotions();
      if (!cancelled) {
        interval = setInterval(() => {
          console.log('[PROMOTION-CONTEXT] Auto-refreshing promotions...');
          refreshPromotions();
        }, REFRESH_INTERVAL);
      }
    };

    window.addEventListener("scroll", startPromotions, { passive: true, once: true });
    window.addEventListener("pointerdown", startPromotions, { passive: true, once: true });
    window.addEventListener("keydown", startPromotions, { passive: true, once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", startPromotions);
      window.removeEventListener("pointerdown", startPromotions);
      window.removeEventListener("keydown", startPromotions);
      if (interval) clearInterval(interval);
    };
  }, [loadPromotions, refreshPromotions]);

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




