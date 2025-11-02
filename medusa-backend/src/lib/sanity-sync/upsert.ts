
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

type DeleteResult = {
  ok: boolean;
  error?: string;
};

/**
 * Delete a product by ID
 */
async function deleteProductREST(productId: string, backendUrl: string): Promise<DeleteResult> {
  try {
    const url = `${backendUrl}/delete-sample-product`;
    
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    const text = await res.text();
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}: ${text}` };
    }

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

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
  let wasDeleted = false;
  
  if (input.sanityId) {
    const searchUrl = `${backendUrl}/store/products?metadata[sanity_id]=${encodeURIComponent(input.sanityId)}`;
    const searchRes = await fetch(searchUrl);

    if (searchRes.ok) {
      const searchData = await searchRes.json() as any;
      existingProductId = searchData.products?.[0]?.id;
    }
  }

  // If product exists, delete it before creating a new one
  if (existingProductId) {
    console.log(`[upsert] Deleting existing product ${existingProductId} for sanity_id=${input.sanityId}`);
    const deleteResult = await deleteProductREST(existingProductId, backendUrl);
    
    if (!deleteResult.ok) {
      console.warn(`[upsert] Failed to delete product ${existingProductId}: ${deleteResult.error}`);
      // Continue anyway - we'll try to create a new one
    } else {
      wasDeleted = true;
      console.log(`[upsert] Successfully deleted product ${existingProductId}`);
    }
  }

  // Always create a new product (either fresh or after deletion)
  const url = `${backendUrl}/create-sample-product`;

  const body = {
    title: input.title,
    subtitle: input.subtitle,
    description: input.description,
    handle: input.handle,
    status: input.status,
    thumbnail: input.thumbnailUrl,
    metadata: {
      sanity_id: input.sanityId,
      images: input.images,
      tags: input.tags,
    },
    variants: input.variants,
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
      productId: json?.product?.id,
      isUpdate: wasDeleted // Count as update if we deleted the old one
    };
  } catch (e: any) {
    return { ok: true, isUpdate: wasDeleted };
  }
}


