import { Instagram, Youtube, Twitter, MapPin } from "lucide-react";
import { useDirection } from "@/contexts/DirectionContext";
import { cn } from "@/lib/utils";

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
    { label: "پشتیبانی", href: links.support },
  ];

  const legalLinks: FooterLink[] = [
    { label: "حریم خصوصی", href: "/privacy" },
    { label: "قوانین و مقررات", href: "/terms" },
    { label: "سیاست بازگشت وجه", href: "/refund" },
  ];

  // Company address (Sharif Technology Tower, Torshate, Tehran)
  // Address: تهران، آزادی، خیابان اکبری، بلوار شهید صالحی (محله طرشت)، برج فناوری شریف طبقه 2 پلاک 3
  const companyAddress = "تهران، آزادی، خیابان اکبری، بلوار شهید صالحی، محله طرشت، برج فناوری شریف";
  const LAT = 35.7036; // Approximate latitude for Sharif Technology Tower area
  const LNG = 51.3515; // Approximate longitude for Sharif Technology Tower area
  
  // Map URLs - using encoded address for Google Maps, coordinates for Neshan
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyAddress)}`;
  const neshanUrl = `https://neshan.org/maps?lat=${LAT}&lng=${LNG}&zoom=16`;

  return (
    <footer 
      dir="rtl" 
      className={cn(
        "relative py-12 px-6",
        "border-t border-border/20",
        "bg-background/95 backdrop-blur-[8px]"
      )}
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section - RIGHT column (col-span-1 md:col-span-2) - Contains "شریف جی‌پی‌تی" heading */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-vazirmatn text-xl font-bold leading-[1.4] text-foreground mb-3 text-right">
              شریف جی‌پی‌تی
            </h3>
            <p className="font-vazirmatn text-sm font-normal leading-relaxed text-muted-foreground max-w-[448px] mb-6 text-right">
              پلتفرم پیشرو در ارائه خدمات دیجیتال، محصولات هوش مصنوعی و دوره‌های آموزشی تخصصی
            </p>
            {/* E-Namad Trust Badge - Below description text, aligned to right edge */}
            <div className="mt-4 flex flex-col items-end w-fit ml-auto">
              <p className="font-vazirmatn text-xs font-normal leading-[1.4] text-muted-foreground mb-2 text-right">
                نشان اعتماد الکترونیکی
              </p>
              <div 
                className={cn(
                  "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg",
                  "bg-background/50 border border-white/10",
                  "flex items-center justify-center",
                  "overflow-hidden"
                )}
              >
                <img
                  src="/logos/image.png"
                  alt="نشان اعتماد الکترونیکی"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Quick Links - 1 column on desktop */}
          <div>
            <h4 className="font-vazirmatn text-sm font-semibold leading-[1.4] text-foreground mb-4">
              دسترسی سریع
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      "font-vazirmatn text-sm font-normal leading-[1.4]",
                      "text-muted-foreground hover:text-foreground",
                      "transition-colors duration-150 ease-in-out",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links & Contact - 1 column on desktop */}
          <div>
            <h4 className="font-vazirmatn text-sm font-semibold leading-[1.4] text-foreground mb-4">
              شبکه‌های اجتماعی
            </h4>
            <div className="flex gap-3 mb-6">
              {socials.map((social) => {
                const Icon = socialIcons[social.type];
                return (
                  <a
                    key={social.type}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "w-10 h-10 rounded-full",
                      "bg-muted/50 hover:bg-muted",
                      "text-muted-foreground hover:text-foreground",
                      "flex items-center justify-center",
                      "transition-all duration-150 ease-in-out",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                    aria-label={social.type}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-vazirmatn text-sm font-semibold leading-[1.4] text-foreground mb-3">
                اطلاعات تماس
              </h4>
              <div className="space-y-2 font-vazirmatn text-sm font-normal leading-relaxed text-muted-foreground">
                <p>آدرس: تهران، آزادی، خیابان اکبری، بلوار شهید صالحی (محله طرشت)، برج فناوری شریف طبقه 2 پلاک 3</p>
                <p>تلفن: 09381296421</p>
              </div>
            </div>

            {/* Interactive Map - Directly under Contact Information */}
            <div className="mt-6 space-y-3">
              {/* Clickable Map Area */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex flex-col items-center justify-center gap-2",
                  "w-full h-[140px]",
                  "px-4 py-3 rounded-lg",
                  "bg-gradient-to-br from-muted/40 to-muted/20",
                  "hover:from-muted/50 hover:to-muted/30",
                  "border border-border/30",
                  "shadow-sm hover:shadow-md",
                  "text-muted-foreground hover:text-foreground",
                  "transition-all duration-150 ease-in-out",
                  "cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
              >
                <MapPin className="h-6 w-6 mb-1" />
                <span className="font-vazirmatn text-xs font-normal leading-[1.4] text-center">
                  مشاهده روی نقشه
                </span>
              </a>

              {/* Map Action Buttons */}
              <div className="flex flex-col gap-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-full px-4 py-2 rounded-lg",
                    "bg-muted/50 hover:bg-muted",
                    "border border-border/30",
                    "text-sm font-vazirmatn font-medium",
                    "text-foreground hover:text-primary",
                    "transition-all duration-150 ease-in-out",
                    "flex items-center justify-center gap-2",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                >
                  <MapPin className="h-4 w-4" />
                  <span>باز کردن در Google Maps</span>
                </a>
                <a
                  href={neshanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-full px-4 py-2 rounded-lg",
                    "bg-muted/50 hover:bg-muted",
                    "border border-border/30",
                    "text-sm font-vazirmatn font-medium",
                    "text-foreground hover:text-primary",
                    "transition-all duration-150 ease-in-out",
                    "flex items-center justify-center gap-2",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                >
                  <MapPin className="h-4 w-4" />
                  <span>باز کردن در نشان</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={cn(
          "mt-8 pt-6",
          "border-t border-border/20",
          "flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        )}>
          <p className="font-vazirmatn text-sm font-normal leading-[1.4] text-muted-foreground">
            © {currentYear} شریف جی‌پی‌تی. تمامی حقوق محفوظ است.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {legalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "font-vazirmatn text-sm font-normal leading-[1.4]",
                  "text-muted-foreground hover:text-foreground",
                  "transition-colors duration-150 ease-in-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
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
