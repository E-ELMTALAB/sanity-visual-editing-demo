import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-surface rounded-lg shadow-neu-out p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-text-strong mb-4">
              شرایط و قوانین استفاده
            </h1>
            <p className="text-sm text-text-muted mb-8">
              آخرین بروزرسانی: دی ۱۴۰۳
            </p>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  ۱. پذیرش شرایط
                </h2>
                <p className="text-text leading-relaxed">
                  با دسترسی و استفاده از خدمات SharifGPT Academy، شما موافقت می‌کنید که توسط این شرایط و قوانین ملزم شوید. اگر با هر بخشی از این شرایط موافق نیستید، نباید از خدمات ما استفاده کنید.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  ۲. حساب کاربری
                </h2>
                <p className="text-text leading-relaxed mb-3">
                  برای دسترسی به برخی از ویژگی‌های خدمات ما، باید حساب کاربری ایجاد کنید. شما مسئول هستید که:
                </p>
                <ul className="list-disc pr-6 text-text space-y-2">
                  <li>اطلاعات دقیق، کامل و به‌روز را ارائه دهید</li>
                  <li>رمز عبور خود را محرمانه نگه دارید</li>
                  <li>تمام فعالیت‌های انجام شده تحت حساب کاربری خود را بپذیرید</li>
                  <li>در صورت استفاده غیرمجاز از حساب خود، فوراً به ما اطلاع دهید</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  ۳. خرید و پرداخت
                </h2>
                <p className="text-text leading-relaxed mb-3">
                  با خرید دوره‌های آموزشی:
                </p>
                <ul className="list-disc pr-6 text-text space-y-2">
                  <li>قیمت‌ها به تومان و شامل مالیات هستند</li>
                  <li>پرداخت از طریق درگاه‌های معتبر بانکی انجام می‌شود</li>
                  <li>پس از پرداخت موفق، دسترسی به دوره فعال می‌شود</li>
                  <li>امکان استرداد وجه تا ۷ روز پس از خرید (در صورت عدم مشاهده بیش از ۲۰٪ محتوا)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  ۴. مالکیت معنوی
                </h2>
                <p className="text-text leading-relaxed">
                  تمامی محتوای ارائه شده در دوره‌ها، شامل اما نه محدود به ویدیوها، متون، تصاویر و کدها، تحت حفاظت قوانین مالکیت معنوی هستند. استفاده، کپی، توزیع یا اشتراک‌گذاری غیرمجاز محتوا ممنوع است.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  ۵. محدودیت مسئولیت
                </h2>
                <p className="text-text leading-relaxed">
                  SharifGPT Academy تلاش می‌کند بهترین کیفیت محتوا و خدمات را ارائه دهد، اما هیچ تضمینی در مورد نتایج یا موفقیت شما ارائه نمی‌دهد. استفاده از خدمات به مسئولیت خود شما است.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-text-strong mb-4">
                  ۶. تغییرات در شرایط
                </h2>
                <p className="text-text leading-relaxed">
                  ما حق داریم این شرایط را در هر زمان تغییر دهیم. تغییرات پس از انتشار در این صفحه لازم‌الاجرا خواهند بود. استفاده مداوم از خدمات پس از تغییرات به معنای پذیرش آن‌ها است.
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
