import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";
import { ProductPrices } from "@/lib/medusa-prices";
import { usePromotions } from "@/contexts/promotion-context";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28
};

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  badge?: string;
  slug?: string;
}

interface BestSellersProps {
  products: Product[];
  onAdd: (id: string) => void;
  productPrices?: Record<string, ProductPrices>;
  className?: string;
}

export function BestSellers({
  products,
  onAdd,
  productPrices,
  className
}: BestSellersProps) {
  const { getPromotionForProduct } = usePromotions();
  
  // Limit to 8 products for 2 rows x 4 columns grid
  const displayProducts = products.slice(0, 8);
  
  return (
    <section className={cn("relative py-8 sm:py-10 lg:py-12 px-6 lg:px-[100px] bg-transparent", className)}>
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={springTransition} 
          className="mb-8 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">
            محصولات منتخب
          </h2>
          <p className="text-foreground/70 text-sm sm:text-base">
            پرفروش‌ترین محصولات ما
          </p>
        </motion.div>

        {/* Grid Container - 2 rows x 4 columns */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full max-w-[1200px]">
            {displayProducts.map((product, index) => {
              // Get promotion info for this product
              const productPriceData = product.slug ? productPrices?.[product.slug] : undefined;
              const medusaVariants = productPriceData?.variants || [];
              const medusaProductId = productPriceData?.product_id; // Medusa product ID
              const validPrices = medusaVariants.filter(v => v.price > 0).map(v => v.price);
              const lowestPrice = validPrices.length > 0 
                ? Math.min(...validPrices)
                : product.price;
              
              // Use Sanity price as original price (before any discounts)
              // If Medusa variant has original_price, use that, otherwise use Sanity price
              const variantWithOriginalPrice = medusaVariants.find(v => v.original_price);
              const originalPrice = variantWithOriginalPrice?.original_price || product.price;
              
              // Use Medusa product ID if available, otherwise fall back to Sanity ID
              const productIdForMatching = medusaProductId || product.id;
              const promotionInfo = product.slug && originalPrice > 0
                ? getPromotionForProduct(product.slug, productIdForMatching, originalPrice)
                : null;

              return (
                <motion.div 
                  key={product.id} 
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{
                    ...springTransition,
                    delay: index * 0.05
                  }}
                >
                  <ProductCard
                    id={product.id}
                    title={product.title}
                    image={product.image}
                    price={product.price}
                    medusaVariants={medusaVariants}
                    slug={product.slug}
                    onAdd={onAdd}
                    promotion={promotionInfo ? {
                      discountPercentage: promotionInfo.discountPercentage,
                      originalPrice: promotionInfo.originalPrice,
                      discountedPrice: promotionInfo.discountedPrice,
                      endsAt: promotionInfo.endsAt,
                    } : undefined}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
