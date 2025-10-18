
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

  // First, try to find existing product by sanity_id (using unauthenticated endpoint)
  let existingProductId: string | undefined;
  if (input.sanityId) {
    const searchUrl = `${backendUrl}/store/products?metadata[sanity_id]=${encodeURIComponent(input.sanityId)}`;
    const searchRes = await fetch(searchUrl);

    if (searchRes.ok) {
      const searchData = await searchRes.json() as any;
      existingProductId = searchData.products?.[0]?.id;
    }
  }

  const isUpdate = !!existingProductId;
  // Use unauthenticated create endpoint instead of admin
  const url = isUpdate 
    ? `${backendUrl}/admin/products/${existingProductId}`
    : `${backendUrl}/create-sample-product`;

  const body = {
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


