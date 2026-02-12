import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send } from "lucide-react";
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

export function FloatingDock({
  onOpenChat,
  onOpenSupport,
  onOpenCart,
  cartItemCount = 0,
}: FloatingDockProps) {
  const { isRTL } = useDirection();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
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
    if (!showNudge) {
      // Reset text when nudge is hidden
      setNudgeText("");
      return;
    }

    // Reset text when nudge is shown
    setNudgeText("");
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
        }, 4000);
      }
    }, 80);

    return () => {
      clearInterval(typeInterval);
      if (nudgeTimeoutRef.current) {
        clearTimeout(nudgeTimeoutRef.current);
        nudgeTimeoutRef.current = undefined;
      }
    };
  }, [showNudge]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
    setShowNudge(false);
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
        {/* Nudge Label - Positioned above button, on the LEFT side (expanding inward) */}
        <AnimatePresence>
          {showNudge && !isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={springTransition}
              className={cn(
                // Bring the bubble closer vertically to the widget
                // Mobile: almost touching, Desktop: a tiny bit more breathing room
                "absolute bottom-full mb-0.5 sm:mb-1",
                // Position on the LEFT side of the button (expanding inward toward center)
                // In LTR: widget is on right, bubble expands left (inward)
                // In RTL: widget is on left, bubble expands right (inward)
                // Tighter on mobile so the bubble feels more connected to the widget,
                // while keeping the original spacing on desktop (sm and up)
                isRTL ? "left-full ml-1 sm:ml-2" : "right-full mr-1 sm:mr-2",
                // Ensure it doesn't get cut off on mobile (with safe margins from screen edge)
                "max-w-[calc(100vw-6rem)] sm:max-w-[280px]",
                "px-4 py-2.5 rounded-xl",
                // High-contrast, brand-tinted background (light with primary tint)
                "bg-gradient-to-br from-primary/25 via-primary/20 to-primary/15",
                "backdrop-blur-[20px]",
                "border border-primary/40",
                "shadow-xl shadow-primary/25",
                "font-vazirmatn text-sm font-semibold leading-[1.4]",
                // High contrast text color - use primary color for better visibility
                "text-primary",
                "whitespace-nowrap",
                // Ensure visibility and prevent overlap
                "z-[10000]"
              )}
            >
              {nudgeText}
              {/* Small arrow pointing down to widget - positioned on the side closest to button */}
              <div
                className={cn(
                  "absolute top-full -mt-[1px]",
                  // Arrow on the side closest to the widget button
                  isRTL ? "right-4" : "left-4",
                  "w-0 h-0",
                  "border-l-[6px] border-r-[6px] border-t-[6px]",
                  "border-l-transparent border-r-transparent",
                  "border-t-primary/25"
                )}
              />
            </motion.div>
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
          className={cn(
            // Mobile: 56px (w-14 h-14) for better touch target, Desktop: 60px
            // Ensure minimum size across all breakpoints
            "relative w-14 h-14 md:w-[60px] md:h-[60px] rounded-full",
            "min-w-[56px] min-h-[56px] md:min-w-[60px] md:min-h-[60px]",
            "bg-gradient-to-br from-primary to-primary/80",
            "border border-primary/30",
            "shadow-2xl shadow-primary/25",
            "flex items-center justify-center",
            "transition-all duration-200",
            // Ensure adequate touch target (at least 44px, we're using 56px+)
            "touch-manipulation"
          )}
        >
          <motion.div
            animate={{ rotate: isChatOpen ? 180 : 0 }}
            transition={springTransition}
            className="flex items-center justify-center"
          >
            {isChatOpen ? (
              <X className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
            ) : (
              <MessageSquare className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
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
                // Adjust bottom position for larger button (56px mobile, 60px desktop)
                "sm:bottom-[96px] md:bottom-[100px] sm:right-4 sm:top-auto",
                // Ensure consistent panel sizes across breakpoints
                "sm:w-[360px] sm:min-w-[360px] md:w-[380px] md:min-w-[380px]",
                "sm:h-[540px] sm:min-h-[480px] md:h-[560px] md:min-h-[500px]",
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
