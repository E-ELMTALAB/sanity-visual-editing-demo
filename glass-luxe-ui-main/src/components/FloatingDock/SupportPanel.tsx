import { useState } from "react";
import { X, Phone, Mail, MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { useDirection } from "@/contexts/DirectionContext";
import { cn } from "@/lib/utils";

interface SupportPanelProps {
  open: boolean;
  onClose: () => void;
}

const faqs = [
  {
    question: "چطور می‌تونم محصولات رو خریداری کنم؟",
    answer: "برای خرید محصولات، کافیه روی دکمه 'افزودن به سبد' کلیک کنید و سپس از صفحه سبد خرید، خرید خود را نهایی کنید.",
  },
  {
    question: "آیا امکان بازگشت محصولات وجود داره؟",
    answer: "بله، شما می‌تونید تا ۷ روز پس از خرید، محصولات دیجیتال رو در صورت عدم رضایت بازگردونید و هزینه رو دریافت کنید.",
  },
  {
    question: "دوره‌ها چه مدت زمان اعتبار دارن؟",
    answer: "تمامی دوره‌ها دسترسی مادام‌العمر دارن و می‌تونید هر زمان که خواستید به اونها دسترسی داشته باشید.",
  },
  {
    question: "آیا گواهینامه برای دوره‌ها صادر میشه؟",
    answer: "بله، پس از اتمام هر دوره و گذراندن موفقیت‌آمیز آزمون‌ها، گواهینامه معتبر برای شما صادر میشه.",
  },
];

export function SupportPanel({ open, onClose }: SupportPanelProps) {
  const { direction } = useDirection();
  const isRTL = direction === "rtl";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock submission
    setTimeout(() => {
      toast({
        title: "پیام شما ارسال شد",
        description: "به زودی با شما تماس خواهیم گرفت.",
      });
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side={isRTL ? "left" : "right"}
        className="glass border-border/50 w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="glass-strong border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-foreground">پشتیبانی و راهنمایی</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-background/50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </SheetHeader>

        <Tabs defaultValue="faq" className="flex-1 flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
          <TabsList className="glass mx-6 mt-4 grid w-auto grid-cols-2">
            <TabsTrigger value="faq">سوالات متداول</TabsTrigger>
            <TabsTrigger value="contact">تماس با ما</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="flex-1 px-6 py-4 overflow-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="glass rounded-lg px-4 border-0"
                >
                  <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="contact" className="flex-1 px-6 py-4 overflow-auto">
            <div className="space-y-6">
              {/* Contact Methods */}
              <div className="space-y-3">
                <a 
                  href="https://t.me/sharifgptadmin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-lg p-4 flex items-center gap-3 hover:bg-background/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">پشتیبانی تلگرام</p>
                    <p className="text-xs text-muted-foreground mb-1">سریع‌ترین راه برای دریافت پاسخ</p>
                    <p className="text-sm text-muted-foreground" dir="ltr">@sharifgptadmin</p>
                  </div>
                </a>

                <a 
                  href="mailto:support@sharifgpt.com"
                  className="glass rounded-lg p-4 flex items-center gap-3 hover:bg-background/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">ایمیل</p>
                    <p className="text-xs text-muted-foreground mb-1">برای سوالات عمومی و همکاری‌ها</p>
                    <p className="text-sm text-muted-foreground" dir="ltr">support@sharifgpt.com</p>
                  </div>
                </a>

                <a 
                  href="https://t.me/sharifgpt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-lg p-4 flex items-center gap-3 hover:bg-background/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">کانال تلگرام</p>
                    <p className="text-xs text-muted-foreground mb-1">اخبار و تخفیف‌ها</p>
                    <p className="text-sm text-muted-foreground" dir="ltr">@sharifgpt</p>
                  </div>
                </a>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="نام و نام خانوادگی"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass"
                    required
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="ایمیل"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glass"
                    required
                    dir="ltr"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="پیام شما..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="glass min-h-[120px]"
                    required
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "در حال ارسال..." : "ارسال پیام"}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
