import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { SectionHeader } from "@/components/ui/section-header";
import { Breadcrumb } from "@/components/ui/breadcrumb-nav";
import { PageIntro } from "@/components/ui/page-intro";
import { ProductCard } from "@/components/Products/ProductCard";
import { FiltersSidebar } from "@/components/Products/FiltersSidebar";
import { FaqAccordion } from "@/components/Products/FaqAccordion";
import { FloatingDock } from "@/components/FloatingDock/FloatingDock";
import { CartDrawer } from "@/components/FloatingDock/CartDrawer";
import { ChatbotPanel } from "@/components/FloatingDock/ChatbotPanel";
import { SupportPanel } from "@/components/FloatingDock/SupportPanel";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDirection } from "@/contexts/DirectionContext";
import type { CartItem } from "@/components/FloatingDock/CartDrawer";

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

const PRODUCTS = [
  {
    id: "p1",
    slug: "chatgpt-advanced",
    title: "پکیج آموزش هوش مصنوعی ChatGPT پیشرفته",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
    price: 899000,
    oldPrice: 1200000,
    discountPct: 25,
  },
  {
    id: "p2",
    slug: "python-ml",
    title: "دوره جامع برنامه‌نویسی Python و یادگیری ماشین",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop",
    price: 1499000,
    oldPrice: 2000000,
    discountPct: 25,
  },
  {
    id: "p3",
    slug: "prompt-engineering",
    title: "کتاب الکترونیکی راهنمای کامل Prompt Engineering",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop",
    price: 349000,
    oldPrice: 450000,
    discountPct: 22,
  },
  {
    id: "p4",
    slug: "gpt4-subscription",
    title: "دسترسی اشتراک ماهانه سرویس GPT-4 Turbo",
    image: "https://images.unsplash.com/photo-1676277791608-ac52e8e3e322?w=800&auto=format&fit=crop",
    price: 599000,
  },
  {
    id: "p5",
    slug: "wordpress-ai-plugin",
    title: "پلاگین تولید محتوای هوشمند برای وردپرس",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
    price: 299000,
    oldPrice: 399000,
    discountPct: 25,
  },
  {
    id: "p6",
    slug: "data-science",
    title: "دوره تخصصی Data Science با پروژه‌های واقعی",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
    price: 1799000,
    oldPrice: 2400000,
    discountPct: 25,
  },
  {
    id: "p7",
    slug: "react-dashboard",
    title: "قالب Dashboard مدیریتی با React و TypeScript",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop",
    price: 449000,
  },
  {
    id: "p8",
    slug: "figma-ui-kit",
    title: "پکیج طراحی UI/UX با Figma - 100 کامپوننت",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
    price: 649000,
    oldPrice: 850000,
    discountPct: 24,
  },
  {
    id: "p9",
    slug: "nextjs-course",
    title: "آموزش ویدیویی Next.js 14 - پروژه محور",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop",
    price: 999000,
    oldPrice: 1350000,
    discountPct: 26,
  },
  {
    id: "p10",
    slug: "seo-tool",
    title: "ابزار SEO هوشمند با قابلیت تحلیل رقبا",
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&auto=format&fit=crop",
    price: 799000,
  },
  {
    id: "p11",
    slug: "devops-docker",
    title: "دوره DevOps و CI/CD با Docker و Kubernetes",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop",
    price: 1599000,
    oldPrice: 2100000,
    discountPct: 24,
  },
  {
    id: "p12",
    slug: "react-components",
    title: "کتابخانه کامپوننت React با Tailwind CSS",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&auto=format&fit=crop",
    price: 399000,
  },
];

const CATEGORIES = [
  { id: "all", label: "همه محصولات" },
  { id: "courses", label: "دوره‌های آموزشی" },
  { id: "ebooks", label: "کتاب‌های الکترونیکی" },
  { id: "tools", label: "ابزارها و پلاگین‌ها" },
  { id: "templates", label: "قالب و کامپوننت" },
  { id: "subscriptions", label: "اشتراک‌ها" },
];

const FAQ_ITEMS = [
  {
    q: "چگونه می‌توانم محصولات دیجیتال را خریداری کنم؟",
    a: "برای خرید محصولات، کافی است روی دکمه 'افزودن به سبد' کلیک کنید و سپس از طریق سبد خرید، فرآیند پرداخت را تکمیل کنید. پس از پرداخت موفق، لینک دانلود محصول برای شما ارسال می‌شود."
  },
  {
    q: "آیا امکان بازگشت وجه وجود دارد؟",
    a: "بله، در صورتی که محصول خریداری شده مطابق توضیحات نباشد، می‌توانید تا 7 روز پس از خرید، درخواست بازگشت وجه خود را ثبت کنید. تیم پشتیبانی ما درخواست شما را بررسی خواهد کرد."
  },
  {
    q: "آیا دوره‌های آموزشی دارای گواهینامه هستند؟",
    a: "بله، تمامی دوره‌های آموزشی ما پس از اتمام و گذراندن آزمون نهایی، گواهینامه معتبر دریافت می‌کنند که می‌توانید آن را در رزومه و پروفایل لینکدین خود قرار دهید."
  },
  {
    q: "چگونه می‌توانم با پشتیبانی تماس بگیرم؟",
    a: "می‌توانید از طریق دکمه پشتیبانی در پایین صفحه، با تیم ما در ارتباط باشید. همچنین می‌توانید از طریق ایمیل support@sharifgpt.ir یا تلگرام با ما در تماس باشید."
  },
  {
    q: "آیا محصولات قابل به‌روزرسانی هستند؟",
    a: "بله، تمامی محصولات به صورت رایگان به‌روزرسانی می‌شوند و شما به عنوان خریدار، به آخرین نسخه محصول دسترسی خواهید داشت."
  },
];

export default function Products() {
  const { isRTL } = useDirection();
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: "",
    ratingMin: 0,
  });
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        toast.success("تعداد محصول در سبد افزایش یافت");
        return prev.map((item) =>
          item.id === productId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      toast.success("محصول به سبد خرید اضافه شد");
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          qty: 1,
        },
      ];
    });
  };

  const handleUpdateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("محصول از سبد خرید حذف شد");
  };

  const handleCheckout = () => {
    toast.success("در حال انتقال به صفحه پرداخت...");
    setCartOpen(false);
  };

  const handleSearch = (query: string) => {
    toast.info(`جستجو برای: ${query}`);
  };

  const handleFiltersChange = (newFilters: {
    categories: string[];
    priceRange: string;
    ratingMin: number;
  }) => {
    setFilters(newFilters);
    console.log("Filters changed:", newFilters);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "خانه",
        "item": "https://sharifgpt.ir/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "فروشگاه محصولات دیجیتال",
        "item": "https://sharifgpt.ir/products"
      }
    ]
  };

  const megaItems = {
    cols: [
      {
        title: "AI Business Solutions",
        titleFa: "راهکارهای هوش مصنوعی کسب‌وکار",
        links: [
          { label: "Project Management", labelFa: "مدیریت پروژه", href: "/products?cat=project-management" },
          { label: "Data Analysis", labelFa: "تحلیل داده", href: "/products?cat=data-analysis" },
          { label: "Automation", labelFa: "اتوماسیون", href: "/products?cat=automation" },
        ],
      },
      {
        title: "Creative & Technical",
        titleFa: "خلاقیت و فناوری",
        links: [
          { label: "Content Generation", labelFa: "تولید محتوا", href: "/products?cat=content" },
          { label: "Video Production", labelFa: "تولید ویدیو", href: "/products?cat=video" },
          { label: "Graphic Design AI", labelFa: "گرافیک با AI", href: "/products?cat=graphic" },
        ],
      },
    ],
    featured: {
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop",
      title: "Master ChatGPT: Advanced Techniques Course",
      titleFa: "دوره پیشرفته ChatGPT: تکنیک‌های حرفه‌ای",
      href: "/products/p1",
      badge: "Featured",
      badgeFa: "پیشنهاد ویژه",
    },
  };

  return (
    <>
      <Helmet>
        <title>فروشگاه محصولات دیجیتال | SharifGPT</title>
        <meta name="description" content="فروشگاه محصولات دیجیتال SharifGPT - دوره‌های آموزشی، کتاب‌های الکترونیکی، ابزارها و قالب‌های آماده در حوزه هوش مصنوعی و برنامه‌نویسی" />
        <link rel="canonical" href="https://sharifgpt.ir/products" />
        <meta property="og:title" content="فروشگاه محصولات دیجیتال | SharifGPT" />
        <meta property="og:description" content="فروشگاه محصولات دیجیتال SharifGPT - دوره‌های آموزشی، کتاب‌های الکترونیکی، ابزارها و قالب‌های آماده در حوزه هوش مصنوعی و برنامه‌نویسی" />
        <meta property="og:url" content="https://sharifgpt.ir/products" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header
          onSearch={handleSearch}
          megaItems={megaItems}
        />

        <main className="flex-1 pt-24 pb-16">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 space-y-8">
            {/* Breadcrumb */}
            <Breadcrumb
              path={[
                { label: "خانه", href: "/" },
                { label: "محصولات" },
              ]}
            />

            {/* Page Intro */}
            <PageIntro
              title="فروشگاه محصولات دیجیتال"
              subtitle="بهترین محصولات دیجیتال با قیمت‌های مناسب"
            />

            {/* Main Content: Filters + Products */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar - Hidden on mobile */}
              <div className="hidden lg:block">
                <FiltersSidebar onChange={handleFiltersChange} />
              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3 space-y-8">
                {/* Category Filters */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springTransition, delay: 0.1 }}
                  className="flex flex-wrap justify-center lg:justify-start gap-3"
                >
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(category.id)}
                      className="min-w-[120px]"
                    >
                      {category.label}
                    </Button>
                  ))}
                </motion.div>

                {/* Products Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ...springTransition, delay: 0.2 }}
                >
                  <SectionHeader
                    title={`${PRODUCTS.length} محصول موجود`}
                    eyebrow="محصولات دیجیتال"
                    className="mb-8"
                  />

                  <div className="max-w-sm sm:max-w-none mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7 lg:gap-x-8 lg:gap-y-10">
                    {PRODUCTS.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          ...springTransition,
                          delay: 0.3 + index * 0.05,
                        }}
                        className="w-full max-w-[280px] mx-auto sm:max-w-none"
                      >
                        <ProductCard
                          id={product.id}
                          slug={product.slug}
                          title={product.title}
                          image={product.image}
                          price={product.price}
                          oldPrice={product.oldPrice}
                          discountPct={product.discountPct}
                          onAdd={handleAddToCart}
                          className="[&>div:first-child]:aspect-[4/5] sm:[&>div:first-child]:aspect-[3/4]"
                        />
                      </motion.div>
                    ))}
                    </div>
                  </div>
                </motion.div>

                {/* FAQ Section */}
                <FaqAccordion items={FAQ_ITEMS} className="mt-16" />
              </div>
            </div>
          </div>
        </main>

        <Footer
          links={{
            products: "/products",
            magazine: "/magazine",
            courses: "/courses",
            pricing: "/pricing",
            support: "/support",
          }}
          socials={[
            { type: "Telegram", href: "https://t.me/sharifgpt" },
            { type: "Instagram", href: "https://instagram.com/sharifgpt" },
            { type: "X", href: "https://twitter.com/sharifgpt" },
          ]}
        />

        <FloatingDock
          onOpenChat={() => setChatOpen(true)}
          onOpenSupport={() => setSupportOpen(true)}
          onOpenCart={() => setCartOpen(true)}
          cartItemCount={cartItems.reduce((sum, item) => sum + item.qty, 0)}
        />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />

        <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} />
        <SupportPanel open={supportOpen} onClose={() => setSupportOpen(false)} />
      </div>
    </>
  );
}
