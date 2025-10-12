import { Router } from "express";
import { wrapHandler } from "@medusajs/medusa";
import crypto from "crypto";

const router = Router();

export default (app: Router) => {
  app.use("/webhooks/sanity-sync", router);

  /**
   * Verify Sanity webhook signature
   */
  function verifyWebhookSignature(req: any): boolean {
    const signature = req.headers["x-sanity-signature"];
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      return false;
    }

    const body = JSON.stringify(req.body);
    const hash = crypto.createHmac("sha256", secret).update(body).digest("hex");
    
    return signature === hash;
  }

  /**
   * Handle Sanity product sync webhook
   * POST /webhooks/sanity-sync
   */
  router.post("/", wrapHandler(async (req, res) => {
    // Verify webhook signature
    if (!verifyWebhookSignature(req)) {
      return res.status(401).json({
        error: "Invalid webhook signature",
      });
    }

    const productService = req.scope.resolve("productService");
    const payload = req.body;

    try {
      const {
        _id: sanityId,
        name,
        slug,
        medusaProductId,
        _type,
      } = payload;

      // Only process product documents
      if (_type !== "product") {
        return res.json({ message: "Not a product, skipping" });
      }

      // Check if product exists in Medusa
      if (medusaProductId) {
        // Update existing product
        await productService.update(medusaProductId, {
          title: name,
          handle: slug?.current || slug,
          metadata: {
            sanityId,
            lastSyncedAt: new Date().toISOString(),
          },
        });

        res.json({
          message: "Product updated successfully",
          medusaProductId,
          action: "update",
        });
      } else {
        // Create new product
        const product = await productService.create({
          title: name,
          handle: slug?.current || slug,
          status: "draft",
          is_giftcard: false,
          discountable: true,
          metadata: {
            sanityId,
            isDigital: true,
            lastSyncedAt: new Date().toISOString(),
          },
        });

        // Note: You'll need to update Sanity with the new Medusa product ID
        // This can be done via a separate API call to Sanity
        res.json({
          message: "Product created successfully",
          medusaProductId: product.id,
          action: "create",
          note: "Please update Sanity with this medusaProductId",
        });
      }
    } catch (error) {
      console.error("Sanity sync error:", error);
      res.status(500).json({
        error: "Failed to sync product",
        message: error.message,
      });
    }
  }));

  /**
   * Handle Sanity product deletion
   * DELETE /webhooks/sanity-sync
   */
  router.delete("/", wrapHandler(async (req, res) => {
    if (!verifyWebhookSignature(req)) {
      return res.status(401).json({
        error: "Invalid webhook signature",
      });
    }

    const productService = req.scope.resolve("productService");
    const { medusaProductId } = req.body;

    try {
      if (medusaProductId) {
        // Archive product instead of deleting (soft delete)
        await productService.update(medusaProductId, {
          status: "archived",
          metadata: {
            archivedAt: new Date().toISOString(),
          },
        });

        res.json({
          message: "Product archived successfully",
          medusaProductId,
        });
      } else {
        res.status(400).json({
          error: "medusaProductId is required",
        });
      }
    } catch (error) {
      console.error("Product deletion error:", error);
      res.status(500).json({
        error: "Failed to archive product",
        message: error.message,
      });
    }
  }));

  return app;
};

