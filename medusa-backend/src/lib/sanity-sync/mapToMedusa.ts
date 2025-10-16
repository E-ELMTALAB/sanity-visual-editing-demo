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
};

export function toHandle(input?: string): string | undefined {
  if (!input) return undefined;
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function mapSanityToUpsertBody(doc: SanityProduct): UpsertBody {
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
  };
}


