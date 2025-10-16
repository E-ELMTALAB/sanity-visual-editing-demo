
export type UpsertBody = {
  sanityId: string;
  title?: string;
  subtitle?: string;
  description?: string;
  handle?: string;
  status?: "draft" | "published";
  thumbnailUrl?: string;
  images?: string[];
  tags?: string[]; // names; IDs are resolved by backend endpoint if implemented
};

type UpsertResult = {
  ok: boolean;
  productId?: string;
  error?: string;
};

export async function upsertProductREST(input: UpsertBody): Promise<UpsertResult> {
  const backendUrl = process.env.BACKEND_URL || process.env.MEDUSA_ADMIN_URL;
  const token = process.env.MEDUSA_ADMIN_TOKEN;
  if (!backendUrl || !token) {
    return { ok: false, error: "Missing BACKEND_URL/MEDUSA_ADMIN_URL or MEDUSA_ADMIN_TOKEN" };
  }

  // Expect an admin endpoint we will add later, or reuse create-full with minimal fields
  const url = `${backendUrl}/admin/products/create-full`;
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
      tag_names: input.tags,
    },
  };

  const res = await fetch(url, {
    method: "POST",
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
    return { ok: true, productId: json?.product?.id };
  } catch (e: any) {
    return { ok: true, productId: undefined };
  }
}


