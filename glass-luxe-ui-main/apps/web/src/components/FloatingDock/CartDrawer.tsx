import { motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Price } from "@/components/ui/price";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";
import { useCart } from "@/contexts/cart-context";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {
  const { direction } = useDirection();
  const { state, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const isRTL = direction === "rtl";

  const items = state.items.map(item => ({
    id: item.id.toString(),
    title: item.title,
    image: item.image,
    price: item.price,
    qty: item.quantity,
    selectedOption: item.selectedOption,
  }));

  const subtotal = state.total;
  const shipping = subtotal > 500000 ? 0 : 50000;
  const total = subtotal + shipping;

  const handleUpdateQty = (id: string, qty: number) => {
    updateQuantity(parseInt(id), qty);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(parseInt(id));
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <Drawer open={open} onOpenChange={onClose} direction={isRTL ? "left" : "right"}>
      <DrawerContent
        className={cn(
          "glass border-border/50 h-full fixed bottom-0 top-0 w-full sm:max-w-md flex flex-col",
          isRTL ? "left-0 right-auto" : "right-0 left-auto"
        )}
      >
        <DrawerHeader className="glass-strong border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DrawerTitle className="text-foreground">سبد خرید</DrawerTitle>
                <p className="text-xs text-muted-foreground">
                  {items.length} محصول
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-background/50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DrawerHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-12">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium mb-1">سبد خرید شما خالی است</p>
              <p className="text-sm text-muted-foreground">
                محصولات مورد نظر خود را به سبد اضافه کنید
              </p>
            </div>
            <Button onClick={onClose} variant="outline" className="glass">
              بازگشت به فروشگاه
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className="glass rounded-lg p-4 will-change-transform"
                    style={{ contain: 'layout' }}
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground mb-1 truncate">
                          {item.title}
                        </h4>
                        {item.selectedOption && (
                          <p className="text-xs text-muted-foreground mb-1">
                            {item.selectedOption}
                          </p>
                        )}
                        <Price
                          current={item.price * item.qty}
                          className="text-sm text-primary mb-2"
                        />
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 glass rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleUpdateQty(item.id, Math.max(1, item.qty - 1))}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.qty}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleUpdateQty(item.id, item.qty + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            <DrawerFooter className="glass-strong border-t border-border/50 px-6 py-4">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">جمع جزء:</span>
                  <Price current={subtotal} className="text-foreground" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">هزینه ارسال:</span>
                  {shipping === 0 ? (
                    <span className="text-green-500 font-medium">رایگان</span>
                  ) : (
                    <Price current={shipping} className="text-foreground" />
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">جمع کل:</span>
                  <Price current={total} className="text-lg font-bold text-primary" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 glass"
                >
                  ادامه خرید
                </Button>
                <Button onClick={handleCheckout} className="flex-1">
                  تسویه حساب
                </Button>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
