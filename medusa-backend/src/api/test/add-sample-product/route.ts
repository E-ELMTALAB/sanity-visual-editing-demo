import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { IProductModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * Test endpoint to add a sample product
 * POST /test/add-sample-product
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
      images: [
        {
          url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
          position: 0,
        },
        {
          url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&q=80",
          position: 1,
        },
        {
          url: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=1200&q=80",
          position: 2,
        },
      ],
      tags: [
        { value: "wireless" },
        { value: "bluetooth" },
        { value: "noise-cancelling" },
        { value: "premium" },
        { value: "bestseller" },
      ],
      options: [
        {
          title: "Color",
          values: ["Midnight Black", "Silver Gray", "Rose Gold"],
        },
      ],
    };

    // Create the product
    const products = await productModuleService.createProducts(productData);
    const product = Array.isArray(products) ? products[0] : products;

    console.log("✅ Product created:", product.id);

    // Create variants for each color
    const colors = [
      { name: "Midnight Black", hex: "#1a1a1a", price: 34999, stock: 150 },
      { name: "Silver Gray", hex: "#c0c0c0", price: 34999, stock: 100 },
      { name: "Rose Gold", hex: "#b76e79", price: 36999, stock: 75 },
    ];

    const createdVariants = [];

    for (const color of colors) {
      const variantData = {
        product_id: product.id,
        title: color.name,
        sku: `HDPHN-AP3000X-${color.name.replace(/\s+/g, "-").toUpperCase()}`,
        barcode: `${product.metadata.sku_prefix}-${color.name.substring(0, 3).toUpperCase()}-001`,
        weight: 250,
        metadata: {
          color_hex: color.hex,
          inventory_quantity: color.stock,
          manage_inventory: true,
          allow_backorder: color.stock < 100,
          prices: [
            {
              currency_code: "usd",
              amount: color.price,
            },
            {
              currency_code: "eur",
              amount: Math.round(color.price * 0.92),
            },
          ],
          most_popular: color.name === "Midnight Black",
          limited_edition: color.name === "Rose Gold",
        },
        options: [
          {
            option: "Color",
            value: color.name,
          },
        ],
      };

      const variants = await productModuleService.createProductVariants(variantData);
      const variant = Array.isArray(variants) ? variants[0] : variants;
      
      console.log(`✅ Variant created: ${color.name} (${variant.id})`);
      
      createdVariants.push({
        ...variant,
        prices: variantData.metadata.prices,
        inventory_quantity: color.stock,
      });
    }

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

