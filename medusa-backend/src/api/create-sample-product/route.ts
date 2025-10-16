import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { IProductModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * Test endpoint to add a sample product
 * POST /create-sample-product
 * 
 * No authentication required - for testing only
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);

    // Sample product data
    const productData = {
      title: "Premium Wireless Headphones Pro",
      subtitle: "Studio-quality sound with advanced noise cancellation",
      description: "Experience immersive audio with our premium wireless headphones. Featuring advanced active noise cancellation, 40-hour battery life, Bluetooth 5.3, and premium comfort for all-day wear. Perfect for music lovers, professionals, and travelers.",
      handle: `premium-wireless-headphones-${Date.now()}`,
      status: "published" as const,
      is_giftcard: false,
      discountable: true,
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      weight: 250,
      length: 20,
      height: 8,
      width: 18,
      origin_country: "US",
      material: "Aluminum, Protein Leather, Premium Plastics",
      metadata: {
        brand: "AudioPro",
        model: "AP-3000X Pro",
        warranty: "2 years international warranty",
        features: [
          "Active Noise Cancellation (ANC)",
          "Bluetooth 5.3 with multipoint connection",
          "40h battery life with fast charging",
          "Premium drivers for studio-quality sound",
          "Comfortable over-ear design"
        ],
        certifications: ["FCC", "CE", "RoHS"],
        release_date: "2025-01-15",
        sku_prefix: "HDPHN-AP3000X"
      },
      // Keep images simple (Medusa v2 can accept string[]); we'll skip to avoid schema mismatch
      // images: [
      //   "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
      //   "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&q=80",
      //   "https://images.unsplash.com/photo-1545127398-14699f92334b?w=1200&q=80",
      // ],
      tags: [
        { value: "wireless" },
        { value: "bluetooth" },
        { value: "noise-cancelling" },
        { value: "premium" },
        { value: "bestseller" },
      ],
      // Avoid defining product options for now to prevent variant option constraint issues
      // options: [
      //   {
      //     title: "Color",
      //     values: ["Midnight Black", "Silver Gray", "Rose Gold"],
      //   },
      // ],
    };

    // Create the product
    const products = await productModuleService.createProducts(productData);
    const product = Array.isArray(products) ? products[0] : products;

    console.log("✅ Product created:", product.id);

    // For reliability, skip creating variants in this test endpoint
    const createdVariants: any[] = [];

    // Fetch the complete product
    const completeProduct = await productModuleService.retrieveProduct(product.id, {
      relations: ["variants", "images", "options", "tags"],
    });

    return res.status(201).json({
      success: true,
      message: "✅ Sample product created successfully!",
      product: {
        id: completeProduct.id,
        title: completeProduct.title,
        subtitle: completeProduct.subtitle,
        description: completeProduct.description,
        handle: completeProduct.handle,
        status: completeProduct.status,
        thumbnail: completeProduct.thumbnail,
        images: completeProduct.images,
        options: completeProduct.options,
        variants: createdVariants,
        tags: completeProduct.tags,
        metadata: completeProduct.metadata,
        created_at: completeProduct.created_at,
      },
      admin_url: `${process.env.BACKEND_URL || "https://backend-production-ea59.up.railway.app"}/app/products/${completeProduct.id}`,
      store_url: `${process.env.BACKEND_URL || "https://backend-production-ea59.up.railway.app"}/store/products/${completeProduct.handle}`,
    });
  } catch (error: any) {
    console.error("❌ Product creation error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack,
      hint: "Check the Railway logs for more details",
    });
  }
};

