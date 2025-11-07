import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";
import { ICartModuleService, IProductModuleService } from "@medusajs/framework/types";
import { applyCorsHeaders, handleCorsPreflight } from "../../../../middleware/global-cors";

/**
 * Create Cart from Frontend Cart Data
 * POST /store/cart/create
 * 
 * Body:
 * {
 *   "items": [
 *     {
 *       "id": 1,
 *       "title": "Product Name",
 *       "price": 100000,
 *       "image": "image_url",
 *       "quantity": 2,
 *       "selectedOption": "option_name"
 *     }
 *   ],
 *   "customer_email": "customer@example.com",
 *   "customer_phone": "+989123456789"
 * }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  // Apply CORS headers
  applyCorsHeaders(req, res);
  
  // Handle preflight requests
  if (handleCorsPreflight(req, res)) {
    return;
  }
  
  try {
    const body = req.body as {
      items: Array<{
        id: number;
        title: string;
        price: number;
        image: string;
        quantity: number;
        selectedOption?: string;
      }>;
      customer_email?: string;
      customer_phone?: string;
    };

    const { items, customer_email, customer_phone } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Items array is required and cannot be empty"
      });
    }

    const cartModuleService: ICartModuleService = req.scope.resolve(Modules.CART);
    const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);

    // Create a new cart
    const cart = await cartModuleService.createCarts({
      currency_code: "irr",
      email: customer_email,
      metadata: {
        customer_phone: customer_phone,
        source: "frontend_cart"
      }
    });

    console.log(`[CART-CREATE] ========== ADDING ITEMS TO CART ==========`);
    console.log(`[CART-CREATE] Cart ID: ${cart.id}`);
    console.log(`[CART-CREATE] Number of items: ${items.length}`);
    console.log(`[CART-CREATE] Items:`, JSON.stringify(items, null, 2));
    
    // Add items to cart
    for (const item of items) {
      try {
        console.log(`[CART-CREATE] --- Processing item: ${item.title} ---`);
        let product;
        let variant;
        
        // SECURE APPROACH: Look up product by sanity_slug (handle) if provided
        if ((item as any).sanity_slug) {
          const sanitySlug = (item as any).sanity_slug;
          const optionName = (item as any).option_name || item.selectedOption;
          
          console.log(`[CART-CREATE] sanity_slug: ${sanitySlug}`);
          console.log(`[CART-CREATE] option_name: ${optionName}`);
          console.log(`[CART-CREATE] Looking up product by handle: ${sanitySlug}`);
          
          // Find product by handle (matches Sanity slug)
          const products = await productModuleService.listProducts({
            handle: sanitySlug
          });
          
          if (!products || products.length === 0) {
            throw new Error(`Product not found with handle: ${sanitySlug}. Please sync from Sanity first.`);
          }
          
          product = products[0];
          
          // Find variant by option name (title) - fetch with prices relation
          const variants = await productModuleService.listProductVariants({
            product_id: product.id
          }, {
            relations: ["prices"]
          });
          
          if (optionName) {
            const matchedVariant = variants.find((v: any) => v.title === optionName);
            if (!matchedVariant) {
              throw new Error(`Variant "${optionName}" not found for product: ${product.title}`);
            }
            variant = matchedVariant;
          } else {
            variant = variants[0];
          }
          
          if (!variant) {
            throw new Error(`No variants found for product: ${product.title}`);
          }
          
          // Get price from standard Medusa pricing (Medusa v2 standard)
          const irrPrice = (variant as any).prices?.find((p: any) => p.currency_code === 'irr');
          const variantPrice = irrPrice?.amount || 0;
          
          if (variantPrice === 0) {
            console.warn(`[CART-CREATE] Warning: Variant ${variant.id} has no IRR price. Please set price in Medusa admin.`);
            throw new Error(`Variant ${variant.title} has no IRR price. Please set price in Medusa admin.`);
          }
          
          console.log(`[CART-CREATE] Using Medusa price: ${variantPrice} Rials (${Math.round(variantPrice/10)} Toman) for variant: ${variant.title}`);
          
          // Add line item to cart with BACKEND price from Medusa variant
          await cartModuleService.addLineItems(cart.id, [{
            variant_id: variant.id,
            quantity: item.quantity,
            title: item.title,
            unit_price: variantPrice, // ✅ Price from Medusa backend (secure)
            metadata: {
              frontend_id: item.id,
              selected_option: item.selectedOption,
              image_url: item.image,
              sanity_slug: sanitySlug
            }
          }]);
          
        } else {
          // FALLBACK: Legacy approach for backward compatibility
          // This creates products on-the-fly (less secure, for testing only)
          console.warn(`[CART-CREATE] Using legacy mode for item: ${item.title} (no sanity_slug provided)`);
          
          // Search for existing product by title
          const products = await productModuleService.listProducts({
            title: item.title
          });
          product = products[0];

          // If product doesn't exist, create it
          if (!product) {
            product = await productModuleService.createProducts({
              title: item.title,
              description: `Product: ${item.title}`,
              status: "published",
              handle: `product-${item.id}-${Date.now()}`,
              is_giftcard: false,
              discountable: true,
              metadata: {
                frontend_id: item.id,
                image_url: item.image,
                selected_option: item.selectedOption
              }
            });

            // Create a variant for the product
            // Note: In Medusa v2, variants are created without prices initially
            // Prices are managed separately via pricing module or admin
            await productModuleService.createProductVariants({
              product_id: product.id,
              title: item.selectedOption || "Default",
              sku: `SKU-${item.id}-${Date.now()}`,
              manage_inventory: false,
              allow_backorder: true
            });
          }

          // Get the product variant with prices (Medusa v2 standard)
          const variants = await productModuleService.listProductVariants({
            product_id: product.id
          }, {
            relations: ["prices"]
          });
          
          // Find variant by option name or use first
          variant = variants[0];
          if (item.selectedOption) {
            const matchedVariant = variants.find((v: any) => v.title === item.selectedOption);
            if (matchedVariant) {
              variant = matchedVariant;
            }
          }

          if (!variant) {
            throw new Error(`No variant found for product: ${product.title}`);
          }
          
          // Get price from standard Medusa pricing (following Medusa v2 conventions)
          const irrPrice = (variant as any).prices?.find((p: any) => p.currency_code === 'irr');
          const variantPrice = irrPrice?.amount || 0;

          if (!variantPrice || variantPrice === 0) {
            throw new Error(`No IRR price found for variant: ${variant.title}. Please set price in Medusa admin.`);
          }

          console.log(`[CART-CREATE] Using Medusa price: ${variantPrice} Rials (${Math.round(variantPrice/10)} Toman)`);

          // Add line item to cart
          await cartModuleService.addLineItems(cart.id, [{
            variant_id: variant.id,
            quantity: item.quantity,
            title: item.title,
            unit_price: variantPrice,
            metadata: {
              frontend_id: item.id,
              selected_option: item.selectedOption,
              image_url: item.image
            }
          }]);
        }

      } catch (error) {
        console.error(`[CART-CREATE] ❌ Error adding item ${item.title} to cart:`, error);
        // Continue with other items even if one fails
      }
    }

    console.log(`[CART-CREATE] ========== RETRIEVING FINAL CART ==========`);
    
    // Retrieve the complete cart with minimal relations to avoid MikroORM errors
    // Avoid mixing payment_collection with item relations
    const completeCart = await cartModuleService.retrieveCart(cart.id, {
      relations: ["items"]
    });
    
    console.log(`[CART-CREATE] Final cart retrieved`);
    console.log(`[CART-CREATE] Cart ID: ${completeCart.id}`);
    console.log(`[CART-CREATE] Items in cart: ${completeCart.items?.length || 0}`);
    console.log(`[CART-CREATE] Cart total: ${completeCart.total}`);
    console.log(`[CART-CREATE] Cart items:`, completeCart.items?.map((i: any) => ({
      id: i.id,
      title: i.title,
      quantity: i.quantity,
      unit_price: i.unit_price,
      variant_id: i.variant_id
    })));
    console.log(`[CART-CREATE] ==========================================`);

    res.status(201).json({
      success: true,
      message: "Cart created successfully",
      cart: {
        id: completeCart.id,
        currency_code: completeCart.currency_code,
        email: completeCart.email,
        items: completeCart.items?.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          title: item.variant?.product?.title || "Unknown Product",
          price: item.unit_price || 0,
          total: (item.unit_price || 0) * item.quantity,
          metadata: item.metadata
        })) || [],
        total: completeCart.total || 0,
        subtotal: completeCart.subtotal || 0,
        tax_total: completeCart.tax_total || 0,
        shipping_total: completeCart.shipping_total || 0,
        metadata: completeCart.metadata
      }
    });

  } catch (error: any) {
    console.error("Error creating cart:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

export const OPTIONS = async (req: MedusaRequest, res: MedusaResponse) => {
  applyCorsHeaders(req, res);
  res.status(200).end();
};
