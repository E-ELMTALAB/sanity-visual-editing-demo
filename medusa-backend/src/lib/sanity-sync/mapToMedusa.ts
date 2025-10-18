import type { SanityProduct } from "./sanityClient";

export type UpsertBody = {
  sanityId: string;
  title?: string;
  subtitle?: string;
  description?: string;
  handle?: string;
  status?: "draft" | "published";
  thumbnailUrl?: string;
  images?: string[];
  tags?: string[];
  variants?: Array<{
    title?: string;
    sku?: string;
    prices?: Array<{
      amount: number;
      currency_code: string;
    }>;
    options?: Record<string, string>;
    inventory_quantity?: number;
    metadata?: {
      original_price?: number;
      discount_percentage?: number;
    };
  }>;
};

export function toHandle(input?: string): string | undefined {
  if (!input) return undefined;
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function mapSanityToUpsertBody(doc: SanityProduct): UpsertBody {
  // Map variants if they exist, otherwise create default variant
  const mappedVariants = doc.variants && doc.variants.length > 0
    ? doc.variants.map((variant) => ({
        title: variant.title || doc.title || "Default",
        sku: variant.sku,
        prices: variant.price ? [{
          amount: Math.round(variant.price * 100), // Convert to cents
          currency_code: "usd"
        }] : undefined,
        options: variant.options,
        inventory_quantity: variant.stock || 0,
        metadata: {
          original_price: variant.originalPrice ? Math.round(variant.originalPrice * 100) : undefined,
          discount_percentage: variant.discountPercentage,
        }
      }))
    : [{
        title: doc.title || "Default",
        prices: doc.price ? [{
          amount: Math.round(doc.price * 100), // Convert to cents
          currency_code: "usd"
        }] : undefined,
        inventory_quantity: doc.stock || 0,
        metadata: {
          original_price: doc.originalPrice ? Math.round(doc.originalPrice * 100) : undefined,
          discount_percentage: doc.discountPercentage,
        }
      }];

  return {
    sanityId: doc._id,
    title: doc.title,
    subtitle: doc.subtitle,
    description: doc.description,
    handle: doc.slug?.current || toHandle(doc.title),
    status: doc.status || "published",
    thumbnailUrl: doc.thumbnailUrl,
    images: doc.images || [],
    tags: doc.tags || [],
    variants: mappedVariants,
  };
}


