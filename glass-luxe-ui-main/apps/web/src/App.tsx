import { Suspense, lazy, useEffect, useState, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DirectionProvider } from "@/contexts/DirectionContext";
import { CartProvider, useCart } from "@/contexts/cart-context";
import { PromotionProvider } from "@/contexts/promotion-context";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";

// Visual Editing - only loaded when in preview mode
const AppVisualEditing = lazy(() => import("./components/visual-editing/VisualEditing"));

// Global Customer Support Widget - lazy loaded
const FloatingDock = lazy(() => import("./components/FloatingDock/FloatingDock").then((m) => ({ default: m.FloatingDock })));

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
  <div
    className="min-h-screen w-full flex items-center justify-center"
    aria-hidden="true"
  >
    <div className="h-8 w-8 rounded-full border-2 border-white/40 border-t-transparent animate-spin" />
  </div>
);

// Feature flag: Temporarily disable customer support widget
// TODO: Re-enable by setting ENABLE_SUPPORT_WIDGET to true when chatbot is ready
const ENABLE_SUPPORT_WIDGET = false;

// Global Customer Support Widget - appears on all pages
// Must be inside CartProvider to access cart state
// Deferred until after window load to avoid blocking LCP
const GlobalCustomerSupport = () => {
  // Temporarily disabled - widget will not render at all
  if (!ENABLE_SUPPORT_WIDGET) return null;

  const { state: cartState } = useCart();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Defer chat widget initialization until after window load to prevent LCP interference
    const initChatWidget = () => setShouldLoad(true);

    if (document.readyState === 'complete') {
      // Page already loaded, use requestIdleCallback
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        requestIdleCallback(initChatWidget, { timeout: 1500 });
      } else {
        setTimeout(initChatWidget, 1500);
      }
    } else {
      // Wait for window load event
      window.addEventListener('load', initChatWidget, { once: true });
    }

    return () => {
      window.removeEventListener('load', initChatWidget);
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <Suspense fallback={null}>
      <FloatingDock
        onOpenChat={() => { }}
        onOpenSupport={() => { }}
        onOpenCart={() => { }}
        cartItemCount={cartState.itemCount}
      />
    </Suspense>
  );
};

const GlobalGradientBackground = () => {
  const interactiveRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interBubble = interactiveRef.current;
    if (!interBubble) return;

    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
    let raf = 0;

    const move = () => {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      raf = requestAnimationFrame(move);
    };

    const onMove = (event: MouseEvent) => {
      tgX = event.clientX;
      tgY = event.clientY;
    };

    window.addEventListener("mousemove", onMove);
    move();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="gradient-bg pointer-events-none -z-10"
    >
      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="gradients-container">
        <div className="g1" />
        <div className="g2" />
        <div className="g3" />
        <div className="g4" />
        <div className="g5" />
        <div ref={interactiveRef} className="interactive" />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
      <DirectionProvider>
        <CartProvider>
          <PromotionProvider>
            <TooltipProvider>
              {/* Global Hero Gradient Background */}
              <GlobalGradientBackground />

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
  </QueryClientProvider>
);

export default App;
