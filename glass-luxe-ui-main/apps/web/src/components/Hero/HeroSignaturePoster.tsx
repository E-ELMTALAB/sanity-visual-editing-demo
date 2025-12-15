import { motion } from "framer-motion";
import heroMock from "@/assets/hero-mock.png";
const springTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 26
};
export function HeroSignaturePoster() {
  return <section className="relative min-h-[68vh] md:min-h-[70vh] flex items-center">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left Column - Brand Content */}
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          ...springTransition,
          delay: 0.1
        }} className="md:col-span-6 flex flex-col justify-center items-center text-center gap-4 md:gap-5">
            <motion.h1 animate={{
            filter: ["drop-shadow(0 0 35px rgba(10, 132, 255, 0.5)) drop-shadow(0 0 65px rgba(255, 90, 200, 0.4))", "drop-shadow(0 0 45px rgba(10, 132, 255, 0.6)) drop-shadow(0 0 80px rgba(255, 90, 200, 0.5))", "drop-shadow(0 0 35px rgba(10, 132, 255, 0.5)) drop-shadow(0 0 65px rgba(255, 90, 200, 0.4))"]
          }} transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }} className="text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] leading-[1.15] font-black bg-gradient-to-r from-[#0A84FF] via-[#7B68EE] to-[#FF5AC8] bg-clip-text text-transparent my-[10px] font-vazirmatn">
              شریف‌GPT — برند هوش تمیز و سریع
            </motion.h1>
            
            <p className="text-[16px] sm:text-[17px] md:text-[18px] text-white/85 line-clamp-2 max-w-prose leading-relaxed">
              تجربه‌ای مینیمال و امن برای اشتراک‌ها و ابزارهای دیجیتال.
            </p>
            
            {/* Trust Pills */}
            <motion.div initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            ...springTransition,
            delay: 0.2
          }} className="hidden md:flex flex-wrap items-center gap-3 pt-1">
              <motion.span whileHover={{
              scale: 1.05,
              y: -2
            }} className="glass-strong px-4 py-2 rounded-full text-[13px] font-medium leading-5 flex items-center gap-2 transition-all duration-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(10,132,255,0.3)] cursor-default border border-white/10">
                <span className="text-lg">🛟</span>
                <span className="text-white/95">پشتیبانی سریع</span>
              </motion.span>
              <motion.span whileHover={{
              scale: 1.05,
              y: -2
            }} className="glass-strong px-4 py-2 rounded-full text-[13px] font-medium leading-5 flex items-center gap-2 transition-all duration-300 hover:bg-white/15 hover:shadow-[0_0_20px_rgba(255,90,200,0.3)] cursor-default border border-white/10">
                <span className="text-lg">♻️</span>
                <span className="text-white/95">تعویض حساب تضمینی</span>
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Right Column - Hero Mock */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          ...springTransition,
          delay: 0.15
        }} className="md:col-span-6 relative flex items-center justify-center py-8 md:py-0">
            {/* Background Halo */}
            <div className="absolute inset-0 -z-10 blur-[80px] md:blur-[100px] opacity-60" style={{
            background: `
                  radial-gradient(40% 35% at 55% 45%, rgba(40,130,255,0.45), rgba(0,0,0,0) 70%),
                  radial-gradient(35% 40% at 65% 60%, rgba(160,90,255,0.42), rgba(0,0,0,0) 72%)
                `
          }} />
            
            {/* Hero Image */}
            <motion.img src={heroMock} alt="شریف‌GPT - نمای اپلیکیشن" loading="lazy" className="w-4/5 max-w-[420px] md:max-w-[480px] lg:max-w-[520px] aspect-[4/5] object-cover rounded-2xl ring-1 ring-white/20 shadow-[0_20px_60px_rgba(10,20,50,.35)]" whileHover={{
            scale: 1.02
          }} transition={{
            duration: 0.2
          }} />
          </motion.div>
        </div>
      </div>
    </section>;
}