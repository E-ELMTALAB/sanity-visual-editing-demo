import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mail, Copy, ExternalLink, Clock, ShieldCheck, Upload, X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SurfaceGlass } from "@/components/ui/surface-glass";
import { toast } from "sonner";
import { z } from "zod";

// Telegram Icon
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "نام باید حداقل ۲ کاراکتر باشد" }),
  email: z.string().trim().email({ message: "ایمیل معتبر وارد کنید" }),
  subject: z.string().trim().min(5, { message: "موضوع باید حداقل ۵ کاراکتر باشد" }),
  message: z.string().trim().min(20, { message: "پیام باید حداقل ۲۰ کاراکتر باشد" }),
  consent: z.boolean().refine((val) => val === true, {
    message: "لطفاً شرایط را بپذیرید",
  }),
});

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    consent: false,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("حجم فایل نباید بیشتر از ۱۰ مگابایت باشد");
        return;
      }
      setUploadedFile(file);
      toast.success("فایل آپلود شد");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      contactSchema.parse(formData);

      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("پیام شما با موفقیت ارسال شد. به‌زودی پاسخ می‌دهیم!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        consent: false,
      });
      setUploadedFile(null);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} کپی شد`);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "تماس با ما - SharifGPT",
    description: "سریع‌ترین راه‌های ارتباط با پشتیبانی شریف‌GPT",
    url: "https://sharifgpt.ai/contact",
  };

  return (
    <>
      <Helmet>
        <title>تماس با ما | SharifGPT</title>
        <meta
          name="description"
          content="با تیم پشتیبانی شریف‌GPT در ارتباط باشید - پشتیبانی ۲۴/۷، تعویض حساب تضمینی"
        />
        <link rel="canonical" href="https://sharifgpt.ai/contact" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header
          onSearch={() => {}}
          active="contact"
        />

        <main className="flex-1 pt-[100px]">
          <div className="max-w-[1100px] mx-auto px-4 md:px-6 lg:px-8 py-12 space-y-8">
            {/* Hero Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center pt-8 pb-6"
            >
              <h1 className="text-[32px] md:text-[42px] lg:text-[48px] font-extrabold mb-4 bg-gradient-to-r from-[#0A84FF] to-[#FF5AC8] bg-clip-text text-transparent">
                تماس با ما
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-[680px] mx-auto">
                سریع‌ترین راه‌های ارتباط با پشتیبانی شریف‌GPT
              </p>
            </motion.section>

            {/* Contact Methods */}
            <section>
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                {/* Telegram */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass rounded-2xl p-6 border border-white/30"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <TelegramIcon />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-center mb-2">تلگرام</h3>
                  <p className="text-sm text-white/70 text-center mb-4">
                    پشتیبانی سریع در تلگرام
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => copyToClipboard("@SharifGPT", "آیدی تلگرام")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="flex-1"
                    >
                      <a
                        href="https://t.me/SharifGPT"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 ml-1" />
                        باز کردن
                      </a>
                    </Button>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-2xl p-6 border border-white/30"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Mail className="w-7 h-7 text-purple-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-center mb-2">ایمیل</h3>
                  <p className="text-sm text-white/70 text-center mb-4">
                    support@sharifgpt.com
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        copyToClipboard("support@sharifgpt.com", "ایمیل")
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="flex-1"
                    >
                      <a href="mailto:support@sharifgpt.com">
                        <Mail className="w-4 h-4 ml-1" />
                        ارسال ایمیل
                      </a>
                    </Button>
                  </div>
                </motion.div>

                {/* Hours */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass rounded-2xl p-6 border border-white/30"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Clock className="w-7 h-7 text-green-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-center mb-2">ساعات کاری</h3>
                  <p className="text-sm text-white/70 text-center mb-2">
                    پاسخ‌گویی روزانه
                  </p>
                  <p className="text-xs text-white/60 text-center">
                    میانگین زمان پاسخ چند دقیقه
                  </p>
                </motion.div>
              </div>
            </section>

            {/* Contact Form */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SurfaceGlass className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                  ارسال پیام
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        نام و نام خانوادگی <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="glass border-white/20"
                        dir="rtl"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        ایمیل <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="glass border-white/20"
                        dir="ltr"
                        required
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">
                      موضوع <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="glass border-white/20"
                      dir="rtl"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      پیام <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="glass border-white/20 min-h-[160px] resize-none"
                      dir="rtl"
                      required
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      پیوست فایل (اختیاری) - حداکثر ۱۰ مگابایت
                    </Label>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("file")?.click()}
                        className="gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        انتخاب فایل
                      </Button>
                      {uploadedFile && (
                        <div className="glass px-3 py-2 rounded-lg flex items-center gap-2 flex-1">
                          <span className="text-sm text-white/80 truncate flex-1">
                            {uploadedFile.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setUploadedFile(null)}
                            className="text-white/60 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      id="file"
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                  </div>

                  {/* Consent */}
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      id="consent"
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) =>
                        setFormData({ ...formData, consent: e.target.checked })
                      }
                      className="mt-1 w-4 h-4 rounded border-white/30 bg-white/10"
                      required
                    />
                    <Label
                      htmlFor="consent"
                      className="text-sm text-white/80 cursor-pointer"
                    >
                      با شرایط و حریم‌خصوصی موافقم <span className="text-red-500">*</span>
                    </Label>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "در حال ارسال..." : "ارسال پیام"}
                  </Button>
                </form>
              </SurfaceGlass>
            </motion.section>

            {/* Info Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SurfaceGlass className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                  <div className="glass border border-white/20 rounded-full px-6 py-3 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-sm md:text-base">
                      پاسخ‌گویی ۲۴/۷
                    </span>
                  </div>
                  <div className="glass border border-white/20 rounded-full px-6 py-3 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-sm md:text-base">
                      تعویض حساب تضمینی
                    </span>
                  </div>
                </div>
              </SurfaceGlass>
            </motion.section>
          </div>
        </main>

        <Footer
          links={{
            products: "/products",
            magazine: "/blog",
            courses: "/products?category=courses",
            pricing: "/products",
            support: "/support",
          }}
          socials={[
            { type: "Telegram", href: "https://t.me/SharifGPT" },
            { type: "Instagram", href: "https://instagram.com/sharifgpt" },
          ]}
        />
      </div>
    </>
  );
}
