export type TagUpsertResult = {
  ok: boolean;
  tagIds: string[];
  errors: string[];
};

export async function upsertTagsByNames(tagNames: string[]): Promise<TagUpsertResult> {
  const backendUrl = process.env.BACKEND_URL || process.env.MEDUSA_ADMIN_URL;
  
  if (!backendUrl) {
    return { ok: false, tagIds: [], errors: ["Missing BACKEND_URL or MEDUSA_ADMIN_URL environment variable"] };
  }

  // For now, skip tag creation since it requires admin access
  // Tags will be stored in metadata instead
  console.log(`[sanitySync] Skipping tag creation for: ${tagNames.join(", ")} (stored in metadata instead)`);
  
  return {
    ok: true,
    tagIds: [],
    errors: [],
  };
}
