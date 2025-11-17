import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { ProductCard } from "@/components/Products/ProductCard";
import { toast } from "sonner";
import instagramBanner from "@/assets/instagram-banner.png";

// Mock collection data
const mockCollections = {
  "instagram": {
    title: "کلکسیون اینستاگرام",
    subtitle: "اکانت‌ها و سرویس‌های پرفروش اینستاگرام",
    cover: instagramBanner,
    products: [{
      id: "p1",
      title: "Instagram Premium",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800",
      price: 249000,
      oldPrice: 299000,
      discountPct: 17
    }, {
      id: "p2",
      title: "Business Suite",
      image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=800",
      price: 189000
    }, {
      id: "p3",
      title: "Creator Account",
      image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=800",
      price: 159000,
      oldPrice: 199000,
      discountPct: 20
    }, {
      id: "p4",
      title: "Professional Tools",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800",
      price: 279000
    }, {
      id: "p5",
      title: "Analytics Pro",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800",
      price: 199000,
      oldPrice: 249000,
      discountPct: 20
    }, {
      id: "p6",
      title: "Growth Package",
      image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=800",
      price: 329000
    }, {
      id: "p7",
      title: "Influencer Kit",
      image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=800",
      price: 399000,
      oldPrice: 499000,
      discountPct: 20
    }, {
      id: "p8",
      title: "Starter Pack",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800",
      price: 149000
    }]
  },
  "social-media": {
    title: "کلکسیون شبکه‌های اجتماعی",
    subtitle: "بهترین سرویس‌ها برای همه پلتفرم‌ها",
    cover: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000",
    products: [{
      id: "s1",
      title: "Multi-Platform Bundle",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800",
      price: 449000,
      oldPrice: 599000,
      discountPct: 25
    }, {
      id: "s2",
      title: "TikTok Creator",
      image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=800",
      price: 199000
    }, {
      id: "s3",
      title: "YouTube Premium",
      image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=800",
      price: 179000,
      oldPrice: 229000,
      discountPct: 22
    }, {
      id: "s4",
      title: "LinkedIn Pro",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800",
      price: 299000
    }, {
      id: "s5",
      title: "Twitter Blue",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800",
      price: 139000
    }, {
      id: "s6",
      title: "Telegram Premium",
      image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=800",
      price: 89000,
      oldPrice: 119000,
      discountPct: 25
    }, {
      id: "s7",
      title: "Pinterest Business",
      image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=800",
      price: 159000
    }, {
      id: "s8",
      title: "Snapchat Plus",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800",
      price: 99000,
      oldPrice: 129000,
      discountPct: 23
    }]
  }
};
export default function Collection() {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const [cartCount, setCartCount] = useState(0);
  const collection = mockCollections[slug as keyof typeof mockCollections] || mockCollections["instagram"];
  const handleAddToCart = (id: string) => {
    setCartCount(prev => prev + 1);
    toast.success("محصول به سبد خرید اضافه شد");
  };
  const handleOpenCart = () => {
    toast.info("سبد خرید");
  };
  const handleSearch = (query: string) => {
    toast.info(`جستجو برای: ${query}`);
  };
  return <>
      <Helmet>
        <title>{collection.title} | شریف‌GPT</title>
        <meta name="description" content={collection.subtitle} />
        <link rel="canonical" href={`https://sharifgpt.com/collections/${slug}`} />
        <meta property="og:title" content={collection.title} />
        <meta property="og:description" content={collection.subtitle} />
        <meta property="og:image" content={collection.cover} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen text-foreground" dir="rtl">
        <Header onSearch={handleSearch} rtl={true} />

        {/* Banner Section */}
        <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden mb-8
                           [mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]
                           [-webkit-mask-image:linear-gradient(to_bottom,black_82%,transparent_100%)]">
          {/* Background Image */}
          <motion.img initial={{
          scale: 1.1,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          duration: 0.8,
          ease: "easeOut"
        }} src={collection.cover} alt={collection.title} className="absolute inset-0 w-full h-full object-cover [filter:brightness(.85)] md:[filter:brightness(1.18)_saturate(1.08)_contrast(1.05)]" />
          
          {/* Brand tint overlay - matches site's blue-purple palette */}
          <div className="absolute inset-0 mix-blend-soft-light opacity-85 md:opacity-60 bg-gradient-to-br from-[#1E67C6]/60 via-transparent to-[#8B5CF6]/60" />
          
          {/* Readability vignette */}
          <div className="absolute inset-0" style={{
          background: "radial-gradient(120% 80% at 85% 50%, rgba(0,0,0,.18) 0%, rgba(0,0,0,.55) 60%, rgba(0,0,0,.70) 100%)"
        }} />

          {/* Content */}
          <div className="relative h-full flex items-end pb-12 md:pb-16 pt-[100px] justify-end">
            <div className="container mx-auto px-4 md:px-6">
              <motion.div initial={{
              opacity: 0,
              y: 30
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.3
            }} className="max-w-3xl text-right mt-[100px] my-0">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 justify-start">
                  <span className="text-foreground font-medium">{collection.title}</span>
                  <span>/</span>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    خانه
                  </Link>
                </nav>

                {/* Glass card with title */}
                <div className="glass rounded-3xl p-6 md:p-8 border border-white/20">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3">
                    {collection.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/80">
                    {collection.subtitle}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="container mx-auto px-4 md:px-6 py-8 pb-20">
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            {/* Section Header */}
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                محصولات {collection.title}
              </h2>
              <p className="text-muted-foreground">
                {collection.products.length} محصول
              </p>
            </div>

            {/* Products Grid - matching homepage style */}
            <div className="max-w-sm sm:max-w-none mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
                {collection.products.map((product, index) => <motion.div key={product.id} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.4,
                delay: 0.1 * index
              }} className="w-full max-w-[280px] mx-auto sm:max-w-none">
                  <ProductCard id={product.id} title={product.title} image={product.image} price={product.price} oldPrice={product.oldPrice} discountPct={product.discountPct} onAdd={handleAddToCart} />
                </motion.div>)}
              </div>
            </div>

            {/* View All Link */}
            {collection.products.length > 12 && <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.5,
            delay: 0.6
          }} className="mt-12 text-center">
                <Link to={`/products?collection=${slug}`} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full glass border border-white/20 hover:border-white/30 text-foreground hover:bg-white/5 transition-all duration-200">
                  مشاهده همه محصولات
                  <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>}
          </motion.div>
        </section>

        <Footer links={{
        products: "/products",
        magazine: "/blog",
        courses: "/products?category=courses",
        pricing: "/products",
        support: "/support"
      }} socials={[{
        type: "Instagram",
        href: "https://instagram.com"
      }, {
        type: "X",
        href: "https://twitter.com"
      }, {
        type: "Telegram",
        href: "https://t.me"
      }]} />
      </div>
    </>;
}