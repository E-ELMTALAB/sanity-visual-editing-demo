
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
  const backendUrl = process.env.BACKEND_URL || process.env.MEDUSA_ADMIN_URL;
  const token = process.env.MEDUSA_ADMIN_TOKEN;
  if (!backendUrl || !token) {
    return { ok: false, error: "Missing BACKEND_URL/MEDUSA_ADMIN_URL or MEDUSA_ADMIN_TOKEN" };
  }

  // First, try to find existing product by sanity_id
  let existingProductId: string | undefined;
  if (input.sanityId) {
    const searchUrl = `${backendUrl}/admin/products?metadata[sanity_id]=${encodeURIComponent(input.sanityId)}`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json() as any;
      existingProductId = searchData.products?.[0]?.id;
    }
  }

  // Upsert tags if provided
  let tagIds: string[] = [];
  if (input.tags && input.tags.length > 0) {
    const tagResult = await upsertTagsByNames(input.tags);
    if (!tagResult.ok) {
      return { ok: false, error: `Tag upsert failed: ${tagResult.errors.join(", ")}` };
    }
    tagIds = tagResult.tagIds;
  }

  const isUpdate = !!existingProductId;
  const url = isUpdate 
    ? `${backendUrl}/admin/products/${existingProductId}`
    : `${backendUrl}/admin/products/create-full`;

  const body = {
    title: input.title,
    subtitle: input.subtitle,
    description: input.description,
    handle: input.handle,
    status: input.status,
    thumbnail: input.thumbnailUrl,
    tags: tagIds,
    metadata: {
      sanity_id: input.sanityId,
      images: input.images,
    },
    // Add variants if provided and not updating
    ...(input.variants && !isUpdate && { variants: input.variants }),
  };

  const res = await fetch(url, {
    method: isUpdate ? "POST" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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


