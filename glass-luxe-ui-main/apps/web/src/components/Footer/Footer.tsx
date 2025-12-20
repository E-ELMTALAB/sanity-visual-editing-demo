import { Instagram, Youtube, Twitter } from "lucide-react";
import { useDirection } from "@/contexts/DirectionContext";

// Telegram icon component
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  type: "Telegram" | "Instagram" | "X" | "YouTube";
  href: string;
}

interface FooterProps {
  links: {
    products: string;
    magazine: string;
    courses: string;
    pricing: string;
    support: string;
  };
  socials: SocialLink[];
}

export function Footer({ links, socials }: FooterProps) {
  const { isRTL } = useDirection();
  const currentYear = new Date().getFullYear();

  const socialIcons = {
    Telegram: TelegramIcon,
    Instagram: Instagram,
    X: Twitter,
    YouTube: Youtube,
  };

  const quickLinks: FooterLink[] = [
    { label: "محصولات", href: links.products },
    { label: "مجله", href: links.magazine },
    { label: "دوره‌ها", href: links.courses },
    { label: "قیمت‌گذاری", href: links.pricing },
    { label: "پشتیبانی", href: links.support },
  ];

  const legalLinks: FooterLink[] = [
    { label: "حریم خصوصی", href: "/privacy" },
    { label: "قوانین و مقررات", href: "/terms" },
    { label: "سیاست بازگشت وجه", href: "/refund" },
  ];

  return (
    <footer className="relative py-12 px-6 border-t border-border/20 bg-background/95 backdrop-blur-sm" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-3 text-foreground">
              شریف جی‌پی‌تی
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              پلتفرم پیشرو در ارائه خدمات دیجیتال، محصولات هوش مصنوعی و دوره‌های آموزشی تخصصی
            </p>

            {/* Trust Badge Section */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-foreground">
                نشان اعتماد الکترونیکی
              </h4>
              <div className="w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
                <span className="text-xs text-muted-foreground text-center px-2">
                  نشان اعتماد
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">
              دسترسی سریع
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">
              شبکه‌های اجتماعی
            </h4>
            <div className="flex gap-3">
              {socials.map((social) => {
                const Icon = socialIcons[social.type];
                return (
                  <a
                    key={social.type}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                    aria-label={social.type}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>

            {/* Contact Information */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-foreground">
                اطلاعات تماس
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <p>آدرس: تهران , آزادی , خیابان اکبری , بلوار شهید صالحی (محله طرشت) , برج فناوری شریف طبقه 2 پلاک 3</p>
                <p>تلفن: 09381296421</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} شریف جی‌پی‌تی. تمامی حقوق محفوظ است.
          </p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
