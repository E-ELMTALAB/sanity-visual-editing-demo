
import { upsertTagsByNames } from "./tags";

export type UpsertBody = {
  sanityId: string;
  title?: string;
  subtitle?: string;
  description?: string;
  handle?: string;
  status?: "draft" | "published";
  thumbnailUrl?: string;
  images?: string[];
  tags?: string[]; // names; will be resolved to IDs
  variants?: Array<{
    title?: string;
    sku?: string;
    prices?: Array<{
      amount: number;
      currency_code: string;
    }>;
    options?: Record<string, string>;
    inventory_quantity?: number;
  }>;
};

type UpsertResult = {
  ok: boolean;
  productId?: string;
  error?: string;
  isUpdate?: boolean;
};

export async function upsertProductREST(input: UpsertBody): Promise<UpsertResult> {
  let backendUrl = process.env.BACKEND_URL || process.env.MEDUSA_ADMIN_URL;
  if (!backendUrl) {
    return { ok: false, error: "Missing BACKEND_URL or MEDUSA_ADMIN_URL environment variable" };
  }

  // Ensure URL has protocol
  if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
    backendUrl = `https://${backendUrl}`;
  }

  // Try to find existing product by handle (more reliable than metadata search)
  let existingProductId: string | undefined;
  let existingSanityId: string | undefined;
  
  if (input.handle) {
    try {
      const searchUrl = `${backendUrl}/store/products?handle=${encodeURIComponent(input.handle)}`;
      const searchRes = await fetch(searchUrl);

      if (searchRes.ok) {
        const searchData = await searchRes.json() as any;
        const product = searchData.products?.[0];
        if (product) {
          existingProductId = product.id;
          existingSanityId = product.metadata?.sanity_id;
        }
      }
    } catch (e) {
      console.error("Error searching for existing product:", e);
    }
  }

  // Determine if this is an update or create
  const isUpdate = !!existingProductId && existingSanityId === input.sanityId;
  
  // If handle exists but belongs to different sanity product, make handle unique
  if (existingProductId && existingSanityId !== input.sanityId) {
    input.handle = `${input.handle}-${Date.now()}`;
  }

  // Use custom endpoint that supports both create and update
  const url = isUpdate 
    ? `${backendUrl}/update-sample-product`
    : `${backendUrl}/create-sample-product`;

  const body = {
    productId: existingProductId, // Only used for updates
    title: input.title,
    subtitle: input.subtitle,
    description: input.description,
    handle: input.handle,
    status: input.status,
    thumbnail: input.thumbnailUrl,
    images: input.images, // Pass images in body, not metadata
    metadata: {
      sanity_id: input.sanityId,
      tags: input.tags, // Store tags in metadata since we can't create them without auth
    },
    // Add variants if provided and not updating
    ...(input.variants && !isUpdate && { variants: input.variants }),
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    return { ok: false, error: `HTTP ${res.status}: ${text}` };
  }
  
  try {
    const json = JSON.parse(text);
    return { 
      ok: true, 
      productId: json?.product?.id || existingProductId,
      isUpdate 
    };
  } catch (e: any) {
    return { ok: true, productId: existingProductId, isUpdate };
  }
}


