import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { DirectionProvider } from "@/contexts/DirectionContext";
import { CartProvider, useCart } from "@/contexts/cart-context";
import { PromotionProvider } from "@/contexts/promotion-context";
import { ScrollToTop } from "./components/ScrollToTop";

// Visual Editing - only loaded when in preview mode
const AppVisualEditing = lazy(() => import("./components/visual-editing/VisualEditing"));

// Global Customer Support Widget - lazy loaded
const FloatingDock = lazy(() => import("./components/FloatingDock/FloatingDock").then((m) => ({ default: m.FloatingDock })));

const Index = lazy(() => import("./pages/Index"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const Support = lazy(() => import("./pages/Support"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Faq = lazy(() => import("./pages/Faq"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Erfan = lazy(() => import("./pages/team/Erfan"));
const Amir = lazy(() => import("./pages/team/Amir"));
const Collection = lazy(() => import("./pages/Collection"));
// Studio is excluded from main bundle - use separate Sanity Studio deployment
// const Studio = lazy(() => import("./pages/Studio"));
const PaymentCallback = lazy(() => import("./pages/PaymentCallback"));
const AdminVerify = lazy(() => import("./pages/AdminVerify"));
const Preview = lazy(() => import("./pages/Preview"));

const queryClient = new QueryClient();

// Defer hydration-heavy toasters until after idle
const DeferredToasters = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const enable = () => setReady(true);
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      requestIdleCallback(enable, { timeout: 1200 });
    } else {
      setTimeout(enable, 400);
    }
  }, []);

  if (!ready) return null;
  return (
    <>
      <Toaster />
      <Sonner />
    </>
  );
};

const RouteFallback = () => (
  <div className="min-h-screen w-full flex items-center justify-center text-white/80">
    در حال بارگذاری...
  </div>
);

// Global Customer Support Widget - appears on all pages
// Must be inside CartProvider to access cart state
const GlobalCustomerSupport = () => {
  const { state: cartState } = useCart();
  
  return (
    <Suspense fallback={null}>
      <FloatingDock
        onOpenChat={() => {}}
        onOpenSupport={() => {}}
        onOpenCart={() => {}}
        cartItemCount={cartState.itemCount}
      />
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <DirectionProvider>
        <CartProvider>
        <PromotionProvider>
        <TooltipProvider>
          {/* Global Unified Background */}
          <div id="unified-bg" className="fixed inset-0 -z-50 pointer-events-none" />
          <style>{`
            /* Unified bg uses tokens from index.css */
            #unified-bg::before{
              content: "";
              position: absolute;
              inset: -20vh -20vw;
              pointer-events: none;
              background:
                radial-gradient(80% 55% at 15% 10%, hsl(var(--bg-blue)) 0%, rgba(0,0,0,0) 60%),
                radial-gradient(70% 60% at 85% 30%, hsl(var(--bg-purple)) 0%, rgba(0,0,0,0) 65%),
                radial-gradient(60% 70% at 30% 90%, hsl(var(--bg-cyan)) 0%, rgba(0,0,0,0) 60%);
              filter: blur(40px) saturate(120%);
              opacity: 0.95;
            }
          `}</style>

          {/* Global toasters (defer until idle to avoid layout thrash) */}
          <DeferredToasters />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment/callback" element={<PaymentCallback />} />
                <Route path="/payment/success" element={<PaymentCallback />} />
                <Route path="/order/confirmation" element={<OrderConfirmation />} />
                <Route path="/policies/refund-replacement" element={<RefundPolicy />} />
                <Route path="/support" element={<Support />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/team/erfan" element={<Erfan />} />
                <Route path="/team/amir" element={<Amir />} />
                <Route path="/collections/:slug" element={<Collection />} />
                {/* Studio excluded - deploy separately via 'npx sanity deploy' */}
                <Route path="/admin/verify" element={<AdminVerify />} />
                {/* Preview route for Sanity visual editing */}
                <Route path="/preview" element={<Preview />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          {/* Global Customer Support Widget - appears on all pages */}
          <GlobalCustomerSupport />
          {/* Visual Editing - only loads in preview mode */}
          <AppVisualEditing />
        </TooltipProvider>
        </PromotionProvider>
        </CartProvider>
      </DirectionProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
