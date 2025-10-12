import { Router } from "express";
import { wrapHandler } from "@medusajs/medusa";

const router = Router();

export default (app: Router) => {
  app.use("/admin/products/sync-status", router);

  /**
   * Get Sanity sync status for all products
   * GET /admin/products/sync-status
   */
  router.get("/", wrapHandler(async (req, res) => {
    const productService = req.scope.resolve("productService");

    try {
      // Get all products
      const [products] = await productService.listAndCount({}, {
        select: ["id", "title", "handle", "status", "metadata"],
      });

      // Check sync status for each product
      const syncStatus = products.map((product) => {
        const metadata = product.metadata || {};
        const sanityId = metadata.sanityId;
        const lastSyncedAt = metadata.lastSyncedAt;

        let status = "unknown";
        if (!sanityId) {
          status = "not_synced";
        } else if (lastSyncedAt) {
          const lastSync = new Date(lastSyncedAt as string);
          const hoursSinceSync = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);
          
          if (hoursSinceSync < 24) {
            status = "synced";
          } else {
            status = "outdated";
          }
        } else {
          status = "needs_sync";
        }

        return {
          medusaId: product.id,
          title: product.title,
          handle: product.handle,
          sanityId,
          lastSyncedAt,
          status,
          productStatus: product.status,
        };
      });

      res.json({
        products: syncStatus,
        summary: {
          total: syncStatus.length,
          synced: syncStatus.filter(p => p.status === "synced").length,
          outdated: syncStatus.filter(p => p.status === "outdated").length,
          notSynced: syncStatus.filter(p => p.status === "not_synced").length,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to fetch sync status",
        message: error.message,
      });
    }
  }));

  return app;
};

