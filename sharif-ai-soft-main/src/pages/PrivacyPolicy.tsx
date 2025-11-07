import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-surface rounded-lg shadow-neu-out p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-text-strong mb-4">
              حریم خصوصی
            </h1>
            <p className="text-sm text-text-muted mb-8">
              آخرین بروزرسانی: دی ۱۴۰۳
            </p>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  ۱. جمع‌آوری اطلاعات
                </h2>
                <p className="text-text leading-relaxed mb-3">
                  ما اطلاعات زیر را از کاربران جمع‌آوری می‌کنیم:
                </p>
                <ul className="list-disc pr-6 text-text space-y-2">
                  <li><strong>اطلاعات شخصی:</strong> نام، ایمیل، شماره تماس که هنگام ثبت‌نام ارائه می‌دهید</li>
                  <li><strong>اطلاعات پرداخت:</strong> اطلاعات تراکنش (نه اطلاعات کارت بانکی که توسط درگاه پرداخت امن مدیریت می‌شود)</li>
                  <li><strong>اطلاعات استفاده:</strong> چگونگی تعامل شما با دوره‌ها و پلتفرم</li>
                  <li><strong>اطلاعات فنی:</strong> IP، مرورگر، سیستم عامل و دستگاه</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  ۲. استفاده از اطلاعات
                </h2>
                <p className="text-text leading-relaxed mb-3">
                  اطلاعات جمع‌آوری شده برای موارد زیر استفاده می‌شود:
                </p>
                <ul className="list-disc pr-6 text-text space-y-2">
                  <li>ارائه و بهبود خدمات آموزشی</li>
                  <li>پردازش پرداخت‌ها و صدور فاکتور</li>
                  <li>ارسال اطلاعیه‌های مربوط به دوره‌ها</li>
                  <li>پاسخ به درخواست‌های پشتیبانی</li>
                  <li>تحلیل و بهبود تجربه کاربری</li>
                  <li>ارسال خبرنامه (در صورت اشتراک)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  ۳. اشتراک‌گذاری اطلاعات
                </h2>
                <p className="text-text leading-relaxed">
                  ما اطلاعات شخصی شما را به فروش نمی‌رسانیم. اطلاعات تنها در موارد زیر به اشتراک گذاشته می‌شود:
                </p>
                <ul className="list-disc pr-6 text-text space-y-2 mt-3">
                  <li>با ارائه‌دهندگان خدمات (مانند درگاه پرداخت) که به حفظ حریم خصوصی متعهد هستند</li>
                  <li>در صورت الزام قانونی یا درخواست مقامات قضایی</li>
                  <li>برای حفاظت از حقوق، امنیت و ایمنی ما یا دیگران</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  ۴. امنیت اطلاعات
                </h2>
                <p className="text-text leading-relaxed">
                  ما از تدابیر امنیتی فنی و سازمانی مناسب برای محافظت از اطلاعات شما در برابر دسترسی، تغییر، افشا یا تخریب غیرمجاز استفاده می‌کنیم. این شامل رمزنگاری SSL، ذخیره‌سازی امن داده و کنترل دسترسی محدود است.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  ۵. حقوق شما
                </h2>
                <p className="text-text leading-relaxed mb-3">
                  شما حق دارید:
                </p>
                <ul className="list-disc pr-6 text-text space-y-2">
                  <li>به اطلاعات شخصی خود دسترسی داشته باشید</li>
                  <li>اصلاح اطلاعات نادرست را درخواست کنید</li>
                  <li>حذف اطلاعات خود را درخواست دهید (با رعایت الزامات قانونی)</li>
                  <li>از دریافت ایمیل‌های تبلیغاتی انصراف دهید</li>
                  <li>نسبت به نحوه استفاده از اطلاعات خود شکایت کنید</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  ۶. کوکی‌ها
                </h2>
                <p className="text-text leading-relaxed">
                  ما از کوکی‌ها و فناوری‌های مشابه برای بهبود تجربه کاربری، تحلیل ترافیک و سفارشی‌سازی محتوا استفاده می‌کنیم. می‌توانید کوکی‌ها را در تنظیمات مرورگر خود مدیریت کنید.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  ۷. تماس با ما
                </h2>
                <p className="text-text leading-relaxed">
                  در صورت هرگونه سوال یا نگرانی در مورد حریم خصوصی، لطفاً با ما تماس بگیرید:
                </p>
                <p className="text-text mt-3">
                  ایمیل: <a href="mailto:privacy@sharifgpt.academy" className="text-primary hover:underline">privacy@sharifgpt.academy</a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
