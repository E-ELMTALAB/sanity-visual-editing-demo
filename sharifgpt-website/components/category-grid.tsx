"use client"

// کامپوننت آیکون برای استفاده در کارت‌ها
const Icon = ({ path, gradient }) => (
  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${gradient}`}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  </div>
)

// کامپوننت کارت دسته‌بندی
const CategoryCard = ({ iconPath, gradient, title, description }) => (
  <div
    className="group relative rounded-3xl shadow-lg p-3 sm:p-4 flex flex-col items-center text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl cursor-pointer border border-white/20 backdrop-blur-sm aspect-square sm:aspect-auto"
    style={{
      backgroundColor: "rgba(48, 146, 190, 0.6)", // Using #3092BE with higher opacity for better text contrast
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "rgba(48, 146, 190, 0.7)"
      e.currentTarget.style.boxShadow = "0 8px 32px rgba(48, 146, 190, 0.3), 0 0 20px rgba(48, 146, 190, 0.2)"
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "rgba(48, 146, 190, 0.6)"
      e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)"
    }}
  >
    <div
      className={`w-8 h-8 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${gradient}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 sm:h-6 sm:w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </svg>
    </div>
    <h3 className="text-white text-xs sm:text-lg font-bold mt-2 sm:mt-3">{title}</h3>
    <p className="text-sky-100 text-sm mt-1 sm:mt-0.5 hidden sm:block">{description}</p>
  </div>
)

// داده‌های مربوط به دسته‌بندی‌ها
const categories = [
  {
    title: "هوش مصنوعی کاربردی",
    description: "ابزارهای روزمره و عمومی",
    iconPath:
      "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
  },
  {
    title: "هوش مصنوعی ساخت عکس",
    description: "تبدیل متن به تصویر",
    iconPath:
      "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm16.5-19.5h-16.5a1.5 1.5 0 00-1.5 1.5v1.5h19.5v-1.5a1.5 1.5 0 00-1.5-1.5z",
    gradient: "bg-gradient-to-br from-sky-500 to-cyan-400",
  },
  {
    title: "هوش مصنوعی ساخت ویدیو",
    description: "ساخت و ویرایش ویدیو",
    iconPath:
      "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z",
    gradient: "bg-gradient-to-br from-red-500 to-orange-500",
  },
  {
    title: "هوش مصنوعی ساخت موزیک",
    description: "آهنگسازی با هوش مصنوعی",
    iconPath:
      "M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5A2.25 2.25 0 0016.5 5.25v1.5",
    gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
  },
  {
    title: "هوش مصنوعی نوشتاری",
    description: "تولید و ویرایش متن",
    iconPath:
      "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125",
    gradient: "bg-gradient-to-br from-amber-500 to-yellow-400",
  },
  {
    title: "هوش مصنوعی برنامه نویسی",
    description: "دستیار هوشمند کدنویسی",
    iconPath: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
    gradient: "bg-gradient-to-br from-rose-500 to-pink-500",
  },
]

// کامپوننت اصلی که فقط شامل گرید کارت‌هاست
const CategoryGrid = () => {
  return (
    <>
      {/* استایل فونت وزیر */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap');
          .font-vazir {
            font-family: 'Vazirmatn', sans-serif;
          }
        `}
      </style>
      {/* کانتینر برای نمایش در صفحه - می‌توانید این بخش را حذف کرده و گرید را مستقیم استفاده کنید */}
      <div className="p-4 font-vazir">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-3 gap-3 sm:gap-6">
          {categories.map((cat, index) => (
            <CategoryCard
              key={index}
              iconPath={cat.iconPath}
              gradient={cat.gradient}
              title={cat.title}
              description={cat.description}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default CategoryGrid
