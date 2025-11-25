import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Headphones, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";

interface FloatingDockProps {
  onOpenChat: () => void;
  onOpenSupport: () => void;
  onOpenCart: () => void;
  cartItemCount?: number;
}

export function FloatingDock({
  onOpenChat,
  onOpenSupport,
  onOpenCart,
  cartItemCount = 0,
}: FloatingDockProps) {
  const { direction } = useDirection();
  const isRTL = direction === "rtl";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "fixed bottom-6 z-50 flex flex-col gap-3",
        isRTL ? "left-6" : "right-6"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Support Widget */}
      <AnimatePresence>
        {isHovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={onOpenSupport}
            className="glass hover:glass-strong group flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Headphones className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">پشتیبانی</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Button */}
      <AnimatePresence>
        {isHovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
            onClick={onOpenCart}
            className="glass hover:glass-strong group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <ShoppingCart className="w-5 h-5 text-primary" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Robot Assistant (Main Button) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenChat}
        className="glass hover:glass-strong group relative flex items-center justify-center w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transition-all will-change-transform"
        style={{ contain: 'layout' }}
      >
        <MessageSquare className="w-6 h-6 text-primary" />
        
        {/* Animated Spark/Eye Effect - CSS only for better performance */}
        <span className="absolute inset-0 rounded-full animate-pulse-ring" />
      </motion.button>
    </div>
  );
}
