import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { DirectionProvider } from "@/contexts/DirectionContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Blog from "./pages/Blog";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import RefundPolicy from "./pages/RefundPolicy";
import Support from "./pages/Support";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import NotFound from "./pages/NotFound";
import Erfan from "./pages/team/Erfan";
import Amir from "./pages/team/Amir";
import Collection from "./pages/Collection";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <DirectionProvider>
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

          {/* Global toasters */}
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/confirmation" element={<OrderConfirmation />} />
              <Route path="/policies/refund-replacement" element={<RefundPolicy />} />
              <Route path="/support" element={<Support />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/team/erfan" element={<Erfan />} />
              <Route path="/team/amir" element={<Amir />} />
              <Route path="/collections/:slug" element={<Collection />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DirectionProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
