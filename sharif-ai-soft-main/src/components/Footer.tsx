import { Link } from "react-router-dom";
import { Sparkles, Mail, Phone, MapPin, Instagram, Linkedin, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
export function Footer() {
  const footerLinks = {
    courses: [{
      label: "آموزش فرانت‌اند V0",
      href: "/course/v0-frontend"
    }, {
      label: "آموزش بک‌اند Codex",
      href: "/course/codex-backend"
    }, {
      label: "آموزش کدنویسی Cursor",
      href: "/course/cursor-fullstack"
    }, {
      label: "همه دوره‌ها",
      href: "/courses"
    }],
    company: [{
      label: "درباره ما",
      href: "/about"
    }, {
      label: "فروش سازمانی",
      href: "/enterprise"
    }, {
      label: "مجله",
      href: "/magazine"
    }, {
      label: "پشتیبانی",
      href: "/support"
    }],
    legal: [{
      label: "قوانین و مقررات",
      href: "/legal/terms"
    }, {
      label: "حریم خصوصی",
      href: "/legal/privacy"
    }, {
      label: "شرایط استفاده",
      href: "/legal/terms"
    }]
  };
  const socialLinks = [{
    icon: Instagram,
    href: "#",
    label: "Instagram",
    color: "hover:text-pink-500"
  }, {
    icon: Linkedin,
    href: "#",
    label: "LinkedIn",
    color: "hover:text-blue-500"
  }, {
    icon: Youtube,
    href: "#",
    label: "YouTube",
    color: "hover:text-red-500"
  }, {
    icon: Send,
    href: "https://t.me/sharifgpt",
    label: "Telegram",
    color: "hover:text-sky-500"
  }];
  return <footer className="relative bg-gradient-to-b from-background via-surface to-surface-2 border-t border-border">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.05),transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-12 py-12 md:py-16">
          {/* Courses Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-text-strong">دوره‌های آموزشی</h4>
            <ul className="space-y-3">
              {footerLinks.courses.map((link, index) => <li key={index}>
                  <Link to={link.href} className="text-text hover:text-primary transition-colors inline-flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    <span className="text-base">{link.label}</span>
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-text-strong">شرکت</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => <li key={index}>
                  <Link to={link.href} className="text-text hover:text-primary transition-colors inline-flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    <span className="text-base">{link.label}</span>
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-text-strong">قوانین</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => <li key={index}>
                  <Link to={link.href} className="text-text hover:text-primary transition-colors inline-flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    <span className="text-base">{link.label}</span>
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-light shadow-neu-out group-hover:shadow-neu-hover transition-all duration-300 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <h3 className="text-lg font-bold text-text-strong">
                  SharifGPT Academy
                </h3>
                <p className="text-xs text-text-muted">
                  آکادمی هوش مصنوعی شریف جی‌پی‌تی
                </p>
              </div>
            </Link>
            
            <p className="text-sm text-text leading-relaxed max-w-md">
              پیشرو در آموزش هوش مصنوعی و توسعه نرم‌افزار در ایران. با ما مسیر حرفه‌ای خود را در دنیای تکنولوژی بسازید.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:info@sharifgpt.academy" className="flex items-center gap-3 text-text hover:text-primary transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm">info@sharifgpt.academy</span>
              </a>
              
              <a href="tel:+982191000000" className="flex items-center gap-3 text-text hover:text-primary transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm">۰۲۱-۹۱۰۰۰۰۰۰</span>
              </a>

              <div className="flex items-center gap-3 text-text">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm leading-relaxed">تهران، میدان آزادی، دانشگاه شریف</span>
              </div>
            </div>
          </div>

        </div>

        {/* Newsletter Section */}
        <div className="py-8 md:py-12 border-t border-border">
          <div className="max-w-2xl mx-auto text-center space-y-4 md:space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-text-strong">
              عضویت در خبرنامه
            </h3>
            <p className="text-sm md:text-base text-text-muted px-4">
              با عضویت در خبرنامه، از آخرین اخبار و دوره‌های آموزشی مطلع شوید
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="ایمیل خود را وارد کنید" className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-strong placeholder:text-text-muted" />
              <Button className="bg-gradient-to-r from-primary to-primary-light text-white font-semibold shadow-neu-out hover:shadow-neu-hover whitespace-nowrap px-6 py-3 h-auto border border-transparent">
                عضویت
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 md:py-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className={`w-11 h-11 rounded-xl bg-surface border border-border hover:border-primary/50 shadow-neu-out hover:shadow-neu-hover flex items-center justify-center text-text-muted ${social.color} transition-all duration-300`}>
                  <social.icon className="w-5 h-5" />
                </a>)}
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-sm text-text-muted">
                © {new Date().getFullYear()} SharifGPT Academy. تمامی حقوق محفوظ است.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}
export default Footer;