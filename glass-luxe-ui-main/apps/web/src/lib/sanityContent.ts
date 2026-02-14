/**
 * Centralized helper for accessing build-time Sanity cache content
 * Provides safe fallbacks when cache is missing or empty
 */

// Import cache exports (generated at build time)
import { promoBannerCache } from "@/data/sanity-cache/index";

interface PromoBannerContent {
  isActive: boolean;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
}

/**
 * Get promo banner content from Sanity cache with safe fallbacks
 * Returns hardcoded default values if cache is missing or empty
 */
export function getPromoBannerContent(): PromoBannerContent {
  // Default fallback values (current hardcoded content)
  const defaults: PromoBannerContent = {
    isActive: true,
    title: "تخفیف ویژه روی اکانت‌های پریمیوم ChatGPT",
    description: "فقط تا پایان شمارش معکوس، می‌توانید اکانت‌های قانونی با تحویل آنی و پشتیبانی واقعی را با قیمت ویژه تهیه کنید.",
    buttonText: "مشاهده پلن‌ها و قیمت‌ها",
    buttonLink: "/products",
  };

  try {
    // Check if cache exists and has valid data
    const cacheData = promoBannerCache;
    console.log('[PromoBanner] using cache', !!cacheData);

    if (!cacheData || typeof cacheData !== 'object') {
      return defaults;
    }

    // Type guard for cache data
    const banner = cacheData as any;

    // Return cache data if active, otherwise fallback to defaults
    if (banner?.isActive === true && banner?.title) {
      return {
        isActive: true,
        title: banner.title || defaults.title,
        subtitle: banner.subtitle || undefined,
        description: banner.description || defaults.description,
        buttonText: banner.buttonText || defaults.buttonText,
        buttonLink: banner.buttonLink || defaults.buttonLink,
      };
    }

    return defaults;
  } catch (error) {
    // If cache import fails or is unavailable, return defaults
    console.warn('[PromoBanner] Cache unavailable, using defaults:', error);
    return defaults;
  }
}

