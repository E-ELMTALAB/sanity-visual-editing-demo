export type TagUpsertResult = {
  ok: boolean;
  tagIds: string[];
  errors: string[];
};

export async function upsertTagsByNames(tagNames: string[]): Promise<TagUpsertResult> {
  const backendUrl = process.env.BACKEND_URL || process.env.MEDUSA_ADMIN_URL;
  const token = process.env.MEDUSA_ADMIN_TOKEN;
  
  if (!backendUrl || !token) {
    return { ok: false, tagIds: [], errors: ["Missing BACKEND_URL or MEDUSA_ADMIN_TOKEN"] };
  }

  const tagIds: string[] = [];
  const errors: string[] = [];

  for (const tagName of tagNames) {
    try {
      // First, try to find existing tag
      const searchUrl = `${backendUrl}/admin/product-tags?value=${encodeURIComponent(tagName)}`;
      const searchRes = await fetch(searchUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json() as any;
        const existingTag = searchData.product_tags?.[0];
        
        if (existingTag) {
          tagIds.push(existingTag.id);
          continue;
        }
      }

      // Create new tag if not found
      const createRes = await fetch(`${backendUrl}/admin/product-tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          value: tagName,
        }),
      });

      if (createRes.ok) {
        const createData = await createRes.json() as any;
        tagIds.push(createData.product_tag.id);
      } else {
        const errorText = await createRes.text();
        errors.push(`Failed to create tag "${tagName}": ${createRes.status} ${errorText}`);
      }
    } catch (error: any) {
      errors.push(`Error processing tag "${tagName}": ${error.message}`);
    }
  }

  return {
    ok: errors.length === 0,
    tagIds,
    errors,
  };
}
