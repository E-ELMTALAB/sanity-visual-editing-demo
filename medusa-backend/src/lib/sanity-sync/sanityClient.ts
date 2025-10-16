import sanityClient from "@sanity/client";

export function getSanityClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_READ_TOKEN;

  if (!projectId || !dataset) {
    throw new Error(
      "Missing Sanity env: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are required"
    );
  }

  return sanityClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: "2023-10-01",
  });
}

export type SanityProduct = {
  _id: string;
  _updatedAt: string;
  title?: string;
  subtitle?: string;
  description?: string;
  slug?: { current?: string };
  thumbnailUrl?: string;
  images?: string[];
  status?: "draft" | "published";
  tags?: string[];
  price?: number;
  stock?: number;
  variants?: Array<{
    title?: string;
    sku?: string;
    price?: number;
    stock?: number;
    options?: Record<string, string>;
  }>;
};

export const DEFAULT_GROQ = `
  *[_type == "product" && (!defined(_deleted) || _deleted == false) && (!defined(disabled) || disabled == false)]{
    _id,
    _updatedAt,
    title,
    subtitle,
    description,
    "slug": slug{current},
    "thumbnailUrl": coalesce(thumbnail.asset->url, thumbnailUrl),
    "images": images[]{asset->url},
    status,
    tags[],
    price,
    stock,
    variants[]{
      title,
      sku,
      price,
      stock,
      options
    }
  }
`;


