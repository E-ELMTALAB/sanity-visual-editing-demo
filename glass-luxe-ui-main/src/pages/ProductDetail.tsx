import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { ProductCard } from "@/components/Products/ProductCard";
import { BlogCard, type BlogPost as BlogCardPost } from "@/components/Blog/BlogCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { ShoppingCart, Check, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { fetchFromSanity } from "@/lib/sanity.client";
import { validateSanityConfig } from "@/lib/sanity.config";
import { productBySlugQuery } from "@/lib/sanity.queries";
import { transformProductDetail } from "@/lib/sanity.transformers";

interface ProductVariant {
  id: string;
  name: string;
  price?: number;
}

interface GalleryImage {
  _key: string;
  url: string;
  alt?: string;
}

interface RelatedProductCard {
  id: string;
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
  discountPct?: number;
  slug?: string;
}

interface ProductDetailData {
  id: string;
  title: string;
  description: string;
  category?: string;
  badges: string[];
  price: number;
  originalPrice?: number;
  discountPct?: number;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  features: string[];
  gallery: GalleryImage[];
  variants: ProductVariant[];
  relatedProducts: RelatedProductCard[];
  relatedPosts: BlogCardPost[];
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isConfigValid = validateSanityConfig();
    if (!slug) {
      setError("شناسه محصول معتبر نیست");
      setIsLoading(false);
      return;
    }
    if (!isConfigValid) {
      setError("اتصال به Sanity پیکربندی نشده است");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadProduct() {
      try {
        setIsLoading(true);
        const result = await fetchFromSanity<any>(productBySlugQuery, { slug });

        if (!isMounted) return;

        if (!result) {
          setError("محصول مورد نظر یافت نشد");
          return;
        }

        const transformed = transformProductDetail(result);
        setProduct(transformed);
        setSelectedVariant(transformed.variants[0]?.id ?? null);
        setSelectedImage(0);
        setError(null);
      } catch (err) {
        console.error("[PRODUCT DETAIL]", err);
        if (isMounted) {
          setError("خطا در بارگذاری اطلاعات محصول");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const galleryImages = product?.gallery ?? [];
  const heroImage = galleryImages[selectedImage]?.url || galleryImages[0]?.url;
  const currentVariant = useMemo(
    () => product?.variants.find((variant) => variant.id === selectedVariant),
    [product?.variants, selectedVariant]
  );
  const currentPrice = currentVariant?.price ?? product?.price ?? 0;
  const currentOldPrice = product?.originalPrice;

  const handleAddToCart = () => {
    toast.success("محصول به سبد خرید اضافه شد");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{error ?? "محصول یافت نشد"}</p>
      </div>
    );
  }

  const pageDescription = product.description || "جزئیات محصول شریف‌GPT";

  return (
    <>
      <Helmet>
        <title>{`${product.title} | SharifGPT`}</title>
        <meta name="description" content={pageDescription.slice(0, 155)} />
        <link rel="canonical" href={`https://sharifgpt.ai/products/${slug}`} />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header onSearch={() => {}} active="Products" />

        <main className="pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 space-y-16">
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Link to="/" className="hover:text-foreground transition-colors">
                خانه
              </Link>
              <span>/</span>
              <Link to="/products" className="hover:text-foreground transition-colors">
                محصولات
              </Link>
              <span>/</span>
              <span className="text-foreground">{product.title}</span>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
              <section className="space-y-4">
                <div className="rounded-3xl overflow-hidden ring-1 ring-white/10 bg-muted/10">
                  {heroImage ? (
                    <img
                      src={heroImage}
                      alt={galleryImages[selectedImage]?.alt || product.title}
                      className="w-full h-full object-cover aspect-square"
                      loading="lazy"
                    />
                  ) : (
                    <div className="aspect-square flex items-center justify-center text-muted-foreground">
                      تصویر در دسترس نیست
                    </div>
                  )}
                </div>

                {galleryImages.length > 1 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {galleryImages.map((image, index) => (
                      <button
                        key={image._key}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                          "rounded-2xl overflow-hidden ring-2 transition-all",
                          selectedImage === index ? "ring-primary" : "ring-transparent"
                        )}
                      >
                        <img
                          src={image.url}
                          alt={image.alt || product.title}
                          className="h-20 w-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {product.badges.map((badge) => (
                      <Badge key={badge} variant="secondary">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold">{product.title}</h1>
                  {product.category && (
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const filled = product.rating ? product.rating >= index + 1 : true;
                      return (
                        <Star
                          key={index}
                          className={cn("w-4 h-4", filled ? "fill-primary text-primary" : "text-muted-foreground")}
                        />
                      );
                    })}
                  </div>
                  {product.rating && <span>{product.rating.toFixed(1)} / 5</span>}
                  {product.reviewCount && <span>({product.reviewCount} نظر)</span>}
                </div>

                <div>
                  <Price current={currentPrice} old={currentOldPrice} className="text-3xl" />
                  {product.discountPct && (
                    <p className="text-xs text-green-500 mt-1">تا {product.discountPct}% تخفیف</p>
                  )}
                </div>

                {product.variants.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">انتخاب طرح</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariant(variant.id)}
                          className={cn(
                            "text-start rounded-2xl border px-4 py-3 transition-all",
                            selectedVariant === variant.id
                              ? "border-primary bg-primary/10"
                              : "border-border/40 hover:border-border"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold">{variant.name}</span>
                            {selectedVariant === variant.id && <Check className="w-4 h-4 text-primary" />}
                          </div>
                          {variant.price && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {variant.price.toLocaleString("fa-IR")} تومان
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="gap-2" onClick={handleAddToCart}>
                    <ShoppingCart className="w-4 h-4" />
                    افزودن به سبد خرید
                  </Button>
                  {!product.inStock && <span className="text-sm text-destructive">ناموجود</span>}
                </div>

                {product.features.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold">ویژگی‌ها</h2>
                    <ul className="space-y-2">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            </div>

            {product.description && (
              <section className="space-y-3">
                <h2 className="text-2xl font-bold">توضیحات محصول</h2>
                <p className="leading-7 text-muted-foreground">{product.description}</p>
              </section>
            )}

            {product.relatedProducts.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">محصولات مرتبط</h2>
                  <Link to="/products" className="text-sm text-primary">
                    مشاهده همه
                  </Link>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {product.relatedProducts.map((item) => (
                    <ProductCard
                      key={item.id}
                      id={item.id}
                      slug={item.slug}
                      title={item.title}
                      image={item.image}
                      price={item.price}
                      oldPrice={item.oldPrice}
                      discountPct={item.discountPct}
                      onAdd={handleAddToCart}
                    />
                  ))}
                </div>
              </section>
            )}

            {product.relatedPosts.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold">مطالب پیشنهادی</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {product.relatedPosts.map((post) => (
                    <BlogCard key={post._id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>

        <Footer
          links={{
            products: "/products",
            magazine: "/blog",
            courses: "/products",
            pricing: "/products",
            support: "/support",
          }}
          socials={[
            { type: "Instagram", href: "https://instagram.com/sharifgpt" },
            { type: "Telegram", href: "https://t.me/sharifgpt" },
          ]}
        />
      </div>
    </>
  );
};

export default ProductDetail;
