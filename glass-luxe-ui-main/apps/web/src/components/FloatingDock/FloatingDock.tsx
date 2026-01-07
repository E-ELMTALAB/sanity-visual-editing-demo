import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, ShoppingCart, Headphones, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";

interface FloatingDockProps {
  onOpenChat: () => void;
  onOpenSupport: () => void;
  onOpenCart: () => void;
  cartItemCount?: number;
}

interface Message {
  id: string;
  role: "user" | "support";
  content: string;
  timestamp: Date;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 220,
  damping: 28,
};

const NUDGE_TEXT = "نیاز به کمک دارید؟";
const GREETING_TITLE = "سلام! 👋";
const GREETING_MESSAGE = "چطور می‌تونم کمکتون کنم؟";

export function FloatingDock({
  onOpenChat,
  onOpenSupport,
  onOpenCart,
  cartItemCount = 0,
}: FloatingDockProps) {
  const { isRTL } = useDirection();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [nudgeText, setNudgeText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "support",
      content: "سلام! به پشتیبانی شریف جی‌پی‌تی خوش آمدید. چطور می‌تونم کمکتون کنم؟",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const nudgeTimeoutRef = useRef<NodeJS.Timeout>();
  const greetingTimeoutRef = useRef<NodeJS.Timeout>();

  // Check if nudge was shown in this session
  useEffect(() => {
    const hasSeenNudge = sessionStorage.getItem("floatingDock_nudgeShown");
    if (!hasSeenNudge) {
      const timer = setTimeout(() => {
        setShowNudge(true);
        sessionStorage.setItem("floatingDock_nudgeShown", "true");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Typewriter effect for nudge
  useEffect(() => {
    if (!showNudge) return;

    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < NUDGE_TEXT.length) {
        setNudgeText(NUDGE_TEXT.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        // Hide nudge after 4 seconds
        nudgeTimeoutRef.current = setTimeout(() => {
          setShowNudge(false);
          // Show greeting after nudge hides
          setTimeout(() => {
            setShowGreeting(true);
            greetingTimeoutRef.current = setTimeout(() => {
              setShowGreeting(false);
            }, 7000);
          }, 300);
        }, 4000);
      }
    }, 80);

    return () => {
      clearInterval(typeInterval);
      if (nudgeTimeoutRef.current) clearTimeout(nudgeTimeoutRef.current);
      if (greetingTimeoutRef.current) clearTimeout(greetingTimeoutRef.current);
    };
  }, [showNudge]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setShowNudge(false);
    setShowGreeting(false);
    setShowActions(false);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Mock response
    setTimeout(() => {
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "support",
        content: "ممنون از پیامتون. تیم پشتیبانی ما به زودی با شما تماس خواهد گرفت.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <>
      {/* Main FAB Button Container */}
      <div
        className={cn(
          "fixed z-[9999]",
          "bottom-4 sm:bottom-6",
          isRTL ? "left-4 sm:left-6" : "right-4 sm:right-6"
        )}
      >
        {/* Nudge Label */}
        <AnimatePresence>
          {showNudge && !isChatOpen && !showActions && (
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={springTransition}
              className={cn(
                "absolute top-1/2 -translate-y-1/2",
                "px-4 py-2 rounded-full",
                "bg-background/95 backdrop-blur-[16px]",
                "border border-primary/20",
                "shadow-lg shadow-black/10",
                "font-vazirmatn text-[13px] font-medium leading-[1.4] text-foreground",
                "whitespace-nowrap",
                isRTL ? "right-[68px] sm:right-[76px]" : "left-[68px] sm:left-[76px]"
              )}
            >
              {nudgeText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Greeting Bubble */}
        <AnimatePresence>
          {showGreeting && !isChatOpen && !showActions && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={handleOpenChat}
              className={cn(
                "absolute cursor-pointer",
                "bottom-[68px] sm:bottom-[72px]",
                "w-[260px] sm:w-[280px] min-w-[220px]",
                "px-4 py-3 rounded-2xl",
                "bg-gradient-to-br from-background/95 via-background/90 to-background/85",
                "border border-primary/15",
                "shadow-xl shadow-black/20",
                "backdrop-blur-[40px]",
                isRTL ? "right-0" : "left-0"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md shadow-primary/30">
                    <MessageSquare className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-vazirmatn text-sm font-semibold leading-[1.4] text-foreground mb-1">
                    {GREETING_TITLE}
                  </p>
                  <p className="font-vazirmatn text-sm font-normal leading-[1.6] text-foreground">
                    {GREETING_MESSAGE}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowGreeting(false);
                  }}
                  className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-muted/50 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <AnimatePresence>
          {showActions && !isChatOpen && (
            <div className="absolute bottom-[64px] sm:bottom-[68px] flex flex-col gap-3">
              {/* Cart Button */}
              <motion.button
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ ...springTransition, delay: 0 }}
                onClick={onOpenCart}
                className={cn(
                  "relative w-10 h-10 sm:w-11 sm:h-11 rounded-full",
                  "bg-gradient-to-br from-primary/10 via-background/80 to-background/70",
                  "border border-primary/20",
                  "shadow-lg shadow-primary/15",
                  "hover:bg-background/90 hover:border-primary/30 hover:scale-105",
                  "transition-all duration-150",
                  "flex items-center justify-center"
                )}
              >
                <ShoppingCart className="w-5 h-5 text-primary" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </motion.button>

              {/* Support Button */}
              <motion.button
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ ...springTransition, delay: 0.05 }}
                onClick={onOpenSupport}
                className={cn(
                  "w-10 h-10 sm:w-11 sm:h-11 rounded-full",
                  "bg-gradient-to-br from-primary/10 via-background/80 to-background/70",
                  "border border-primary/20",
                  "shadow-lg shadow-primary/15",
                  "hover:bg-background/90 hover:border-primary/30 hover:scale-105",
                  "transition-all duration-150",
                  "flex items-center justify-center"
                )}
              >
                <Headphones className="w-5 h-5 text-primary" />
              </motion.button>
            </div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          whileHover={{ scale: 1.02, opacity: 0.95 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (isChatOpen) {
              handleCloseChat();
            } else {
              handleOpenChat();
            }
          }}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
          className={cn(
            "relative w-12 h-12 sm:w-14 sm:h-14 rounded-full",
            "bg-gradient-to-br from-primary to-primary/80",
            "border border-primary/30",
            "shadow-2xl shadow-primary/25",
            "flex items-center justify-center",
            "transition-all duration-200"
          )}
        >
          <motion.div
            animate={{ rotate: isChatOpen ? 180 : 0 }}
            transition={springTransition}
          >
            {isChatOpen ? (
              <X className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
            ) : (
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
            )}
          </motion.div>

          {/* Pulsing Ring Animation */}
          {!isChatOpen && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-primary/60"
              animate={{
                scale: [1, 1.8],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          )}
        </motion.button>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Mobile: Fullscreen */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "fixed z-[10002]",
                "inset-0 sm:inset-auto",
                "sm:bottom-[88px] sm:right-4 sm:top-auto",
                "sm:w-[360px] sm:h-[540px]",
                "sm:rounded-2xl",
                "bg-gradient-to-br from-background/98 via-background/95 to-background/90",
                "border border-primary/15",
                "shadow-2xl shadow-black/30",
                "backdrop-blur-[64px]",
                "flex flex-col",
                "overflow-hidden"
              )}
            >
              {/* Header */}
              <div
                className={cn(
                  "px-4 sm:px-6 py-4",
                  "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
                  "border-b border-primary/10",
                  "flex items-center justify-between gap-3"
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                      <MessageSquare className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-background" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-vazirmatn text-base font-bold leading-[1.5] text-foreground">
                      پشتیبانی SharifGPT
                    </h3>
                    <p className="font-vazirmatn text-xs font-normal leading-[1.4] text-muted-foreground">
                      در چند دقیقه پاسخ می‌دهیم
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseChat}
                  className="w-8 h-8 rounded-full hover:bg-muted/50 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2.5",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted/60 border border-primary/10 rounded-bl-md"
                      )}
                    >
                      <p
                        className={cn(
                          "font-vazirmatn text-sm font-normal leading-[1.6]",
                          message.role === "user"
                            ? "text-primary-foreground"
                            : "text-foreground"
                        )}
                      >
                        {message.content}
                      </p>
                      <p
                        className={cn(
                          "font-vazirmatn text-[10px] font-normal leading-[1.2] mt-1",
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {message.timestamp.toLocaleTimeString("fa-IR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted/60 border border-primary/10 rounded-2xl rounded-bl-md px-4 py-2.5">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{
                              opacity: [0.3, 1, 0.3],
                              scale: [1, 1.2, 1],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="px-4 sm:px-6 py-4 border-t border-primary/10">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="پیام خود را بنویسید..."
                    dir="rtl"
                    className={cn(
                      "flex-1 h-10 px-4 py-2.5 rounded-full",
                      "bg-muted/40 border border-primary/10",
                      "focus:border-primary/30 focus:ring-2 focus:ring-primary/20 focus:outline-none",
                      "font-vazirmatn text-sm font-normal leading-[1.4]",
                      "text-foreground placeholder:text-muted-foreground",
                      "transition-all duration-150"
                    )}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      "bg-gradient-to-br from-primary to-primary/80",
                      "shadow-md shadow-primary/20",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "hover:opacity-90 transition-opacity"
                    )}
                  >
                    <Send
                      className={cn(
                        "w-4 h-4 text-primary-foreground",
                        isRTL && "rotate-180"
                      )}
                    />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
