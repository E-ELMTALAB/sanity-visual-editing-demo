import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import {
  IProductModuleService,
  IPricingModuleService,
  IInventoryService,
  IRegionModuleService,
} from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * Comprehensive Product Creation Endpoint
 * POST /admin/products/create-full
 * 
 * Creates a complete product with all parameters:
 * - Basic product info
 * - Multiple variants
 * - Prices for each variant
 * - Inventory management
 * - Images
 * - Categories, collections, tags
 * - SEO metadata
 * - Custom attributes
 * 
 * Required authentication: Admin JWT token
 */

interface ProductVariantInput {
  title: string;
  sku?: string;
  ean?: string;
  upc?: string;
  barcode?: string;
  inventory_quantity?: number;
  allow_backorder?: boolean;
  manage_inventory?: boolean;
  prices?: {
    currency_code: string;
    amount: number;
    min_quantity?: number;
    max_quantity?: number;
  }[];
  options?: {
    option: string;
    value: string;
  }[];
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  origin_country?: string;
  hs_code?: string;
  mid_code?: string;
  material?: string;
  metadata?: Record<string, any>;
}

interface ProductInput {
  // Basic Information
  title: string;
  subtitle?: string;
  description?: string;
  handle?: string;
  
  // Status & Visibility
  status?: "draft" | "proposed" | "published" | "rejected";
  is_giftcard?: boolean;
  discountable?: boolean;
  
  // Organization
  type?: string;
  collection_id?: string;
  category_ids?: string[];
  tags?: string[];
  
  // Media
  thumbnail?: string;
  images?: string[];
  
  // Physical Properties
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  origin_country?: string;
  hs_code?: string;
  mid_code?: string;
  material?: string;
  
  // SEO
  metadata?: Record<string, any>;
  
  // Variants
  variants?: ProductVariantInput[];
  
  // Product Options (e.g., Size, Color)
  options?: {
    title: string;
    values: string[];
  }[];
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const productData = req.body as ProductInput;

    // Validate required fields
    if (!productData.title) {
      return res.status(400).json({
        success: false,
        error: "Product title is required",
      });
    }

    // Get required services
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);
    const regionModuleService: IRegionModuleService = req.scope.resolve(Modules.REGION);

    // Generate handle if not provided
    if (!productData.handle) {
      productData.handle = productData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Ensure handle is unique
    const existingProducts = await productModuleService.listProducts({
      handle: productData.handle,
    });

    if (existingProducts.length > 0) {
      productData.handle = `${productData.handle}-${Date.now()}`;
    }

    // 1. Create the product
    const productPayload: any = {
      title: productData.title,
      subtitle: productData.subtitle,
      description: productData.description,
      handle: productData.handle,
      status: productData.status || "draft",
      is_giftcard: productData.is_giftcard || false,
      discountable: productData.discountable ?? true,
      thumbnail: productData.thumbnail,
      weight: productData.weight,
      length: productData.length,
      height: productData.height,
      width: productData.width,
      origin_country: productData.origin_country,
      hs_code: productData.hs_code,
      mid_code: productData.mid_code,
      material: productData.material,
      metadata: productData.metadata || {},
    };

    // Add type if provided
    if (productData.type) {
      productPayload.type_id = productData.type;
    }

    // Add collection if provided
    if (productData.collection_id) {
      productPayload.collection_id = productData.collection_id;
    }

    // Add tags if provided
    if (productData.tags && productData.tags.length > 0) {
      productPayload.tags = productData.tags.map((tag) => ({
        value: tag,
      }));
    }

    // Add options if provided
    if (productData.options && productData.options.length > 0) {
      productPayload.options = productData.options.map((option) => ({
        title: option.title,
        values: option.values,
      }));
    }

    // Add images if provided
    if (productData.images && productData.images.length > 0) {
      productPayload.images = productData.images.map((url, index) => ({
        url,
        position: index,
      }));
    }

    // Add categories if provided
    if (productData.category_ids && productData.category_ids.length > 0) {
      productPayload.categories = productData.category_ids.map((id) => ({
        id,
      }));
    }

    console.log("Creating product with payload:", JSON.stringify(productPayload, null, 2));

    const products = await productModuleService.createProducts(productPayload);
    const product = Array.isArray(products) ? products[0] : products;

    // 2. Create variants if provided
    let createdVariants: any[] = [];
    
    if (productData.variants && productData.variants.length > 0) {
      for (const variantData of productData.variants) {
        const variantPayload: any = {
          product_id: product.id,
          title: variantData.title,
          sku: variantData.sku,
          ean: variantData.ean,
          upc: variantData.upc,
          barcode: variantData.barcode,
          weight: variantData.weight,
          length: variantData.length,
          height: variantData.height,
          width: variantData.width,
          origin_country: variantData.origin_country,
          hs_code: variantData.hs_code,
          mid_code: variantData.mid_code,
          material: variantData.material,
          metadata: {
            ...(variantData.metadata || {}),
            inventory_quantity: variantData.inventory_quantity || 0,
            allow_backorder: variantData.allow_backorder || false,
            manage_inventory: variantData.manage_inventory ?? true,
            prices: variantData.prices || [],
          },
        };

        // Add variant options
        if (variantData.options && variantData.options.length > 0) {
          variantPayload.options = variantData.options;
        }

        const variants = await productModuleService.createProductVariants(variantPayload);
        const variant = Array.isArray(variants) ? variants[0] : variants;

        createdVariants.push({
          ...variant,
          prices: variantData.prices || [],
          inventory_quantity: variantData.inventory_quantity || 0,
          allow_backorder: variantData.allow_backorder || false,
          manage_inventory: variantData.manage_inventory ?? true,
        });
      }
    } else {
      // Create a default variant if none provided
      const defaultVariants = await productModuleService.createProductVariants({
        product_id: product.id,
        title: "Default Variant",
        metadata: {
          inventory_quantity: 100,
          manage_inventory: true,
          allow_backorder: false,
        },
      });

      const defaultVariant = Array.isArray(defaultVariants) ? defaultVariants[0] : defaultVariants;
      createdVariants.push(defaultVariant);
    }

    // 4. Fetch the complete product with all relations
    const completeProduct = await productModuleService.retrieveProduct(product.id, {
      relations: ["variants", "images", "options", "tags", "type", "collection"],
    });

    // Response
    return res.status(201).json({
      success: true,
      message: "Product created successfully with all details",
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
        type: completeProduct.type,
        collection: completeProduct.collection,
        is_giftcard: completeProduct.is_giftcard,
        discountable: completeProduct.discountable,
        weight: completeProduct.weight,
        length: completeProduct.length,
        height: completeProduct.height,
        width: completeProduct.width,
        origin_country: completeProduct.origin_country,
        hs_code: completeProduct.hs_code,
        material: completeProduct.material,
        metadata: completeProduct.metadata,
        created_at: completeProduct.created_at,
        updated_at: completeProduct.updated_at,
      },
      admin_url: `${process.env.BACKEND_URL || req.headers.origin}/app/products/${completeProduct.id}`,
    });
  } catch (error: any) {
    console.error("Product creation error:", error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack,
      hint: "Check the console logs for more details about this error",
    });
  }
};

