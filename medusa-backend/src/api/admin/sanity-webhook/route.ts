import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { mapSanityToUpsertBody } from "../../../lib/sanity-sync/mapToMedusa";
import { upsertProductREST } from "../../../lib/sanity-sync/upsert";
import type { SanityProduct } from "../../../lib/sanity-sync/sanityClient";

// Verify webhook signature (optional but recommended)
function verifyWebhookSignature(req: MedusaRequest): boolean {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("SANITY_WEBHOOK_SECRET not set, skipping signature verification");
    return true;
  }

  const signature = req.headers["x-sanity-signature"] as string;
  if (!signature) {
    return false;
  }

  // Simple signature verification (you may want to implement proper HMAC verification)
  return signature === secret;
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    // Verify webhook signature
    if (!verifyWebhookSignature(req)) {
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    const body = req.body as any;
    
    // Handle different webhook types
    if (body.type === "mutation") {
      const { result } = body;
      
      // Process each document in the mutation
      for (const doc of result) {
        if (doc._type === "product") {
          const sanityProduct: SanityProduct = {
            _id: doc._id,
            _updatedAt: doc._updatedAt,
            title: doc.title,
            subtitle: doc.subtitle,
            description: doc.description,
            slug: doc.slug,
            thumbnailUrl: doc.thumbnailUrl,
            images: doc.images,
            status: doc.status,
            tags: doc.tags,
            price: doc.price,
            stock: doc.stock,
            variants: doc.variants,
          };

          const upsertBody = mapSanityToUpsertBody(sanityProduct);
          const result = await upsertProductREST(upsertBody);
          
          if (!result.ok) {
            console.error(`Failed to sync product ${doc._id}:`, result.error);
            res.status(500).json({
              error: `Failed to sync product: ${result.error}`
            });
            return;
          }
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
