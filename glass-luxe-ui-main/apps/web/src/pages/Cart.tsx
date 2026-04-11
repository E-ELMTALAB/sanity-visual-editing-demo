import { useState } from "react";
import { Helmet } from "@/components/Helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Price } from "@/components/ui/price";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDirection } from "@/contexts/DirectionContext";
import { cn } from "@/lib/utils";
interface CartItem {
  id: string;
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
  qty: number;
  options?: {
    label: string;
    value: string;
  }[];
}
const Cart = () => {
  const {
    isRTL
  } = useDirection();
  const [cartItems, setCartItems] = useState<CartItem[]>([{
    id: "1",
    title: "هدفون بلوتوثی سونی WH-1000XM5",
    image: "/placeholder.svg",
    price: 15500000,
    oldPrice: 18000000,
    qty: 1,
    options: [{
      label: "رنگ",
      value: "مشکی"
    }, {
      label: "گارانتی",
      value: "۲ ساله"
    }]
  }, {
    id: "2",
    title: "ساعت هوشمند اپل واچ سری 9",
    image: "/placeholder.svg",
    price: 22000000,
    qty: 2,
    options: [{
      label: "سایز",
      value: "45mm"
    }]
  }]);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const updateQty = (id: string, delta: number) => {
    setCartItems(items => items.map(item => item.id === id ? {
      ...item,
      qty: Math.max(1, item.qty + delta)
    } : item));
  };
  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };
  const applyDiscount = () => {
    if (discountCode.toLowerCase() === "save10") {
      setAppliedDiscount(0.1);
    }
  };
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = subtotal * appliedDiscount;
  const total = subtotal - discount;
  const handleOpenCart = () => {
    // Cart is already open on this page
  };
  const handleSearch = (query: string) => {
    console.log("Search:", query);
  };
  const megaItems = {
    cols: [],
    featured: {
      image: "",
      title: "",
      titleFa: "",
      href: "",
      badge: "",
      badgeFa: ""
    }
  };
  const footerLinks = {
    products: "/products",
    magazine: "/blog",
    courses: "/courses",
    pricing: "/pricing",
    support: "/support"
  };
  const footerSocials = [{
    type: "Telegram" as const,
    href: "https://t.me/sharifgpt"
  }, {
    type: "Instagram" as const,
    href: "https://instagram.com/sharifgpt"
  }, {
    type: "YouTube" as const,
    href: "https://youtube.com/sharifgpt"
  }, {
    type: "X" as const,
    href: "https://twitter.com/sharifgpt"
  }];
  return <>
      <Helmet>
        <title>سبد خرید | فروشگاه آرکتیک</title>
        <meta name="description" content="سبد خرید شما در فروشگاه آرکتیک" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header onSearch={handleSearch} megaItems={megaItems} />

        <main className="flex-1 py-10">
          <div className="max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8 my-[115px]">
            {cartItems.length === 0 ? <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="glass rounded-2xl p-12 text-center">
                <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-muted-foreground opacity-40" />
                <h2 className="text-2xl font-bold mb-3">سبد شما خالی است</h2>
                <p className="text-muted-foreground mb-6">
                  محصولاتی را که می‌پسندید به سبد خرید اضافه کنید
                </p>
                <Button asChild>
                  <Link to="/products">
                    بازگشت به فروشگاه
                  </Link>
                </Button>
              </motion.div> : <div className="grid lg:grid-cols-[1fr_360px] gap-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold mb-6">سبد خرید</h1>
                  
                  <div role="region" aria-live="polite" aria-atomic="true" className="sr-only">
                    {cartItems.length} مورد در سبد خرید
                  </div>

                  <AnimatePresence mode="popLayout">
                    {cartItems.map(item => <motion.div key={item.id} layout initial={{
                  opacity: 0,
                  scale: 0.9
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} exit={{
                  opacity: 0,
                  scale: 0.9
                }} className="glass rounded-xl p-4 flex gap-4">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          <img src={item.image} alt={item.title} loading="lazy" className="w-24 h-24 object-cover rounded-lg" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="font-bold text-lg line-clamp-2">
                              {item.title}
                            </h3>
                            <button onClick={() => removeItem(item.id)} className="flex-shrink-0 p-2 hover:bg-destructive/20 rounded-lg transition-colors" aria-label="حذف از سبد">
                              <X className="w-5 h-5 text-destructive" />
                            </button>
                          </div>

                          {/* Options */}
                          {item.options && <div className="flex flex-wrap gap-2 mb-3">
                              {item.options.map((opt, i) => <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted/50 text-muted-foreground">
                                  {opt.label}: {opt.value}
                                </span>)}
                            </div>}

                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <Price current={item.price} old={item.oldPrice} className="text-base" />

                            {/* Quantity Stepper */}
                            <div className="flex items-center gap-2 glass-subtle rounded-lg p-1">
                              <button onClick={() => updateQty(item.id, -1)} disabled={item.qty <= 1} className={cn("p-2 rounded-md transition-colors", item.qty <= 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-primary/20")} aria-label="کاهش تعداد">
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-bold" role="status">
                                {item.qty}
                              </span>
                              <button onClick={() => updateQty(item.id, 1)} className="p-2 rounded-md hover:bg-primary/20 transition-colors" aria-label="افزایش تعداد">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>)}
                  </AnimatePresence>
                </div>

                {/* Order Summary - Sticky */}
                <div className="lg:sticky lg:top-24 h-fit space-y-4">
                  <div className="glass rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-bold mb-4">خلاصه سفارش</h2>

                    {/* Subtotal */}
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>جمع کل</span>
                      <Price current={subtotal} className="text-sm" />
                    </div>

                    {/* Discount Code */}
                    <div className="space-y-2">
                      <label htmlFor="discount-code" className="text-sm font-medium">
                        کد تخفیف
                      </label>
                      <div className="flex gap-2">
                        <Input id="discount-code" type="text" placeholder="کد تخفیف" value={discountCode} onChange={e => setDiscountCode(e.target.value)} className="glass-subtle" />
                        <Button onClick={applyDiscount} variant="outline" size="sm">
                          اعمال
                        </Button>
                      </div>
                      {appliedDiscount > 0 && <motion.p initial={{
                    opacity: 0,
                    y: -10
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} className="text-xs text-green-500">
                          ✓ تخفیف ۱۰٪ اعمال شد
                        </motion.p>}
                    </div>

                    {/* Discount */}
                    {appliedDiscount > 0 && <motion.div initial={{
                  opacity: 0,
                  y: -10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} className="flex items-center justify-between text-green-500">
                        <span>تخفیف</span>
                        <Price current={discount} className="text-sm" />
                      </motion.div>}

                    {/* Tax Note */}
                    <p className="text-xs text-muted-foreground border-t border-border-glass pt-4">
                      مالیات و هزینه ارسال در مرحله پرداخت محاسبه می‌شود
                    </p>

                    {/* Total */}
                    <div className="flex items-center justify-between text-xl font-bold pt-2 border-t border-border-glass" role="status" aria-live="polite" aria-atomic="true">
                      <span>مجموع</span>
                      <Price current={total} />
                    </div>

                    {/* CTA */}
                    <Button className="w-full" size="lg">
                      ادامه خرید → پرداخت
                    </Button>

                    <Button variant="ghost" className="w-full" asChild>
                      <Link to="/products" className="flex items-center justify-center gap-2">
                        <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
                        ادامه خرید
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>}
          </div>
        </main>

        <Footer links={footerLinks} socials={footerSocials} />
      </div>
    </>;
};
export default Cart;