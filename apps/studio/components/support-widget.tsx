"use client"

import { useState } from "react"

// کامپوننت آیکون پشتیبانی (شبیه هدست)
const SupportIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white"
  >
    <path d="M12 1a9 9 0 0 0-9 9v7c0 1.7 1.3 3 3 3h3v-8H5v-2a7 7 0 0 1 14 0v2h-4v8h4a2 2 0 0 0 2-2v-7a9 9 0 0 0-9-9z"></path>
    <path d="M18 19a3 3 0 0 1-6 0"></path>
  </svg>
)

// کامپوننت آیکون تلگرام
const TelegramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="mr-2"
  >
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-1.37.2-1.61L21.2 4.11c.7-.24 1.21.24.96.95L17.24 18.1c-.28.8-1.03 1.01-1.73.63l-4.12-3.23-1.95 1.89c-.23.23-.42.42-.83.42z" />
  </svg>
)

// کامپوننت آیکون بستن
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-600/80 hover:text-slate-900"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

// کامپوننت سوالات متداول
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  return (
    <details className="group mb-3 last:mb-0">
      <summary className="flex items-center justify-between p-4 bg-white/40 rounded-3xl cursor-pointer hover:bg-white/60 transition-all duration-300 transform perspective-1000 group-open:rounded-b-none">
        <h3 className="text-sm font-semibold text-slate-800">{question}</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-600 transition-transform duration-300 group-open:rotate-180"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </summary>
      <div className="p-4 bg-white/20 text-slate-700 text-sm rounded-b-3xl shadow-inner">{answer}</div>
    </details>
  )
}

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const faqs = [
    {
      question: "چطور می‌توانم سفارشم را ثبت کنم؟",
      answer:
        "برای ثبت سفارش، محصول مورد نظر خود را به سبد خرید اضافه کرده و سپس مراحل پرداخت را دنبال کنید. فرآیند بسیار ساده و سریع است.",
    },
    {
      question: "آیا ارسال به تمام نقاط کشور دارید؟",
      answer:
        "بله، ما از طریق پست پیشتاز و تیپاکس به تمام شهرهای ایران ارسال داریم. هزینه ارسال بر اساس موقعیت شما محاسبه می‌شود.",
    },
    {
      question: "زمان تحویل سفارش چقدر است؟",
      answer: "سفارشات در تهران طی ۱ تا ۲ روز کاری و در شهرستان‌ها طی ۳ تا ۵ روز کاری به دست شما خواهد رسید.",
    },
    {
      question: "چگونه می‌توانم سفارشم را پیگیری کنم؟",
      answer:
        "پس از ارسال سفارش، کد رهگیری پستی برای شما از طریق پیامک ارسال می‌شود که می‌توانید از طریق وب‌سایت اداره پست، وضعیت بسته خود را پیگیری کنید.",
    },
  ]

  // استایل‌های لازم برای انیمیشن نور
  const animationStyle = `
    @keyframes pulse-blue {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
      }
    }
    .animate-pulse-blue {
      animation: pulse-blue 2s infinite;
    }
    /* Custom Scrollbar Styles */
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, rgb(59 130 246 / 0.7), rgb(6 182 212 / 0.7));
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(to bottom, rgb(59 130 246), rgb(6 182 212));
    }
  `

  return (
    <div className="font-sans">
      <style>{animationStyle}</style>

      {/* Widget Popup */}
      <div
        dir="rtl"
        className={`fixed bottom-24 right-5 sm:right-10 w-[90vw] max-w-sm p-5 rounded-3xl shadow-2xl transition-all duration-500 ease-in-out transform z-50
        ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
        bg-gradient-to-br from-sky-300/40 to-white/30 backdrop-blur-2xl border border-white/50`}
        style={{ perspective: "1000px" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">پشتیبانی و راهنما</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-black/10 transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* FAQ Section */}
        <div className="mb-6">
          <h3 className="text-slate-700 text-sm mb-3">سوالات متداول</h3>
          <div className="max-h-60 overflow-y-auto pl-2 custom-scrollbar">
            {faqs.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center border-t border-white/50 pt-5">
          <p className="text-slate-700 text-sm mb-4">پاسخ خود را پیدا نکردید؟ با ما در ارتباط باشید.</p>
          <a
            href="https://t.me/Sharifgptadmin"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-lg hover:shadow-xl hover:shadow-cyan-500/40 transform hover:-translate-y-1.5 transition-all duration-300"
          >
            ارتباط با پشتیبانی در تلگرام
            <TelegramIcon />
          </a>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 sm:right-10 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-2xl z-50 transform hover:scale-110 transition-transform duration-300 animate-pulse-blue"
        aria-label="Open support widget"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white"
        >
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-1.37.2-1.61L21.2 4.11c.7-.24 1.21.24.96.95L17.24 18.1c-.28.8-1.03 1.01-1.73.63l-4.12-3.23-1.95 1.89c-.23.23-.42.42-.83.42z" />
        </svg>
      </button>
    </div>
  )
}
