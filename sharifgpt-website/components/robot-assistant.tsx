"use client"

import { useState, useEffect } from "react"

// هوک سفارشی برای افکت تایپ
const useTypingEffect = (text, speed = 50) => {
  const [typedText, setTypedText] = useState("")

  useEffect(() => {
    setTypedText("") // ریست کردن متن با تغییر پیام
    if (text) {
      let i = 0
      const intervalId = setInterval(() => {
        if (i < text.length) {
          // This approach is more reliable than appending characters
          // It builds the substring from the source text on each iteration
          setTypedText(text.substring(0, i + 1))
          i++
        } else {
          clearInterval(intervalId)
        }
      }, speed)
      return () => clearInterval(intervalId)
    }
  }, [text, speed])

  return typedText
}

// کامپوننت اصلی ربات دستیار
export default function App() {
  return null

  // const [horizontalPosition, setHorizontalPosition] = useState(2)
  // const [verticalPosition, setVerticalPosition] = useState(5) // Start at 5vh from bottom
  // const [message, setMessage] = useState("")
  // const [isBubbleVisible, setIsBubbleVisible] = useState(false)
  // const lastMessageRef = useRef("")

  // const staticMessages = {
  //   0: "سلام! به وب‌سایت ما خوش اومدی. آماده‌ای برای یه گشت و گذار هیجان‌انگیز؟",
  //   25: "برای اینکه سریع‌تر به هدفت برسی، می‌تونی از دسته‌بندی محصولات استفاده کنی!",
  //   50: "راستی! ما تو شریف‌جی‌پی‌تی دوره‌های آموزشی خفنی داریم که مهارت‌هات رو به سطح دیگه‌ای می‌بره!",
  //   75: "اگه محصولی که می‌خوای اینجا نیست، فقط به پشتیبانی خبر بده. ما برات فراهمش می‌کنیم!",
  //   95: "به انتهای صفحه رسیدی! اگه کمکی خواستی، پشتیبانی ما همیشه آماده‌ست تا راهنماییت کنه.",
  // }

  // const typedMessage = useTypingEffect(message, 30)

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  //     if (scrollHeight <= 0) return
  //     const scrollTop = window.scrollY
  //     const scrollPercent = (scrollTop / scrollHeight) * 100

  //     const sidePhase = Math.sin((scrollTop / scrollHeight) * Math.PI * 3) // 3 cycles for more movement
  //     const isLeftSide = sidePhase > 0
  //     const newHorizontalPos = isLeftSide
  //       ? 5 + 10 * Math.abs(Math.sin((scrollPercent / 100) * Math.PI * 4)) // Left side: 5-15% (more to the left)
  //       : 70 + 10 * Math.abs(Math.sin((scrollPercent / 100) * Math.PI * 4)) // Right side: 70-80% (closer to center)

  //     setHorizontalPosition(newHorizontalPos)

  //     const verticalPhase = Math.sin((scrollPercent / scrollHeight) * Math.PI * 2.5) // 2.5 cycles
  //     const isTopArea = verticalPhase > 0
  //     const newVerticalPos = isTopArea
  //       ? 25 + 15 * Math.abs(Math.sin((scrollPercent / 100) * Math.PI * 5)) // Top area: 25-40vh from bottom (much lower)
  //       : 5 + 15 * Math.abs(Math.sin((scrollPercent / 100) * Math.PI * 5)) // Bottom area: 5-20vh from bottom (lower)

  //     setVerticalPosition(newVerticalPos)

  //     const thresholds = Object.keys(staticMessages).map(Number)
  //     const currentThreshold = thresholds.reduce((prev, curr) => (scrollPercent >= curr ? curr : prev), 0)
  //     const newMessage = staticMessages[currentThreshold]

  //     if (newMessage && newMessage !== lastMessageRef.current) {
  //       lastMessageRef.current = newMessage
  //       setMessage(newMessage)
  //       setIsBubbleVisible(true)
  //     }
  //   }

  //   setTimeout(() => {
  //     setMessage(staticMessages[0])
  //     setIsBubbleVisible(true)
  //     lastMessageRef.current = staticMessages[0]
  //   }, 1500)

  //   window.addEventListener("scroll", handleScroll, { passive: true })
  //   return () => window.removeEventListener("scroll", handleScroll)
  // }, [])

  // return (
  //   <div className="font-sans">
  //     {/* Robot Character */}
  //     <div
  //       className="fixed w-20 h-20 z-50 transition-all duration-1000 ease-out"
  //       style={{
  //         left: `calc(${horizontalPosition}% - 40px)`,
  //         bottom: `${verticalPosition}vh`,
  //       }}
  //     >
  //       {/* Speech Bubble */}
  //       <div
  //         className={`absolute bottom-full mb-4 w-64 p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-2xl transition-all duration-500 origin-bottom
  //           ${isBubbleVisible && message ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
  //         style={{ transform: "translateX(-50%)", left: "50%" }}
  //       >
  //         <p className="text-slate-800 text-sm leading-relaxed text-right" dir="rtl">
  //           {typedMessage}
  //           <span className="inline-block w-1.5 h-4 bg-blue-500 animate-pulse ml-1"></span>
  //         </p>
  //         <div className="absolute left-1/2 -bottom-2 w-4 h-4 bg-white/80 backdrop-blur-md transform -translate-x-1/2 rotate-45"></div>
  //       </div>

  //       {/* Robot Body */}
  //       <div className="w-full h-full relative animate-bounce-slow flex items-center justify-center">
  //         {/* ... Robot SVG/Design code remains the same ... */}
  //         <div className="w-[90%] h-[90%] bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl shadow-xl relative">
  //           <div className="absolute w-full -top-3.5 flex justify-between px-5">
  //             <div className="w-1.5 h-5 bg-indigo-500 rounded-full transform -rotate-12 relative">
  //               <div className="absolute -top-1 -left-1 w-3 h-3 bg-sky-300 rounded-full"></div>
  //             </div>
  //             <div className="w-1.5 h-5 bg-indigo-500 rounded-full transform rotate-12 relative">
  //               <div className="absolute -top-1 -right-1 w-3 h-3 bg-sky-300 rounded-full"></div>
  //             </div>
  //           </div>
  //           <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3.5 bg-sky-200 rounded-full border-2 border-sky-300"></div>
  //           <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-6 h-12 bg-indigo-500 rounded-lg shadow-md"></div>
  //           <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-6 h-12 bg-indigo-500 rounded-lg shadow-md"></div>
  //           <div className="w-full h-full flex flex-col items-center justify-center pt-2">
  //             <div className="flex gap-3">
  //               <div className="w-3.5 h-6 bg-cyan-300 rounded-full shadow-[0_0_10px_3px_rgba(56,189,248,0.7)] border border-slate-300"></div>
  //               <div className="w-3.5 h-6 bg-cyan-300 rounded-full shadow-[0_0_10px_3px_rgba(56,189,248,0.7)] border border-slate-300"></div>
  //             </div>
  //             <div className="w-5 h-0.5 bg-slate-300 rounded-full mt-2.5"></div>
  //           </div>
  //           <div className="absolute top-2 left-2 w-5 h-5 bg-white/30 rounded-full transform -rotate-45 blur-md"></div>
  //         </div>
  //       </div>
  //     </div>
  //     <style>{`
  //       @keyframes bounce-slow { 0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); } 50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); } }
  //       .animate-bounce-slow { animation: bounce-slow 3s infinite; }
  //     `}</style>
  //   </div>
  // )
}
