import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import PixelStarfield from "./PixelStarfield";
export default function AuroraHero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [starCount, setStarCount] = useState(900);
  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Optimize star count based on device
    const isMobile = window.innerWidth < 768;
    const isLowEndDevice = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
    if (isLowEndDevice || isMobile) {
      setStarCount(600); // Reduce stars on mobile/low-end devices
    }
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  return <motion.section dir="rtl" className="relative grid min-h-screen place-content-center overflow-hidden bg-transparent px-4 py-24 text-gray-200">
      {/* Pixel Starfield Background */}
      <PixelStarfield />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-0 mx-0 my-[50px]">
        <h1 className="max-w-4xl bg-gradient-to-br from-white to-gray-300 bg-clip-text text-5xl font-display font-black leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight" style={{
        filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.6)) drop-shadow(0 0 80px rgba(59,130,246,0.4))'
      }}>
          خرید اکانت ChatGPT با ضمانت
        </h1>
        <p className="my-6 max-w-2xl text-sm leading-relaxed text-white/85 md:text-lg md:leading-relaxed">
          سریع‌ترین روش برای خرید اشتراک ChatGPT و ChatGPT Plus در ایران. اکانت خود را فورا اصل بگیرید.
        </p>
        
        {/* Features */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 my-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-950/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm md:text-base text-white/90">پشتیبانی ۲۴/۷</span>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-950/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm md:text-base text-white/90">اکانت های اصل</span>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-950/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm md:text-base text-white/90">تضمین تعویض</span>
          </div>
        </div>

        <motion.button whileHover={prefersReducedMotion ? {} : {
        scale: 1.015
      }} whileTap={prefersReducedMotion ? {} : {
        scale: 0.985
      }} className="group relative flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 px-6 py-3 text-white font-semibold transition-all duration-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
          </svg>
          کانال تلگرام ما
        </motion.button>
      </div>
    </motion.section>;
}