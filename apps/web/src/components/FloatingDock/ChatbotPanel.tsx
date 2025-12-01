import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useDirection } from "@/contexts/DirectionContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatbotPanelProps {
  open: boolean;
  onClose: () => void;
}

const quickSuggestions = [
  "محصولات پیشنهادی",
  "دوره‌های جدید",
  "راهنمای خرید",
  "پشتیبانی فنی",
];

const mockResponses = [
  "چطور می‌تونم کمکتون کنم؟ 😊",
  "لطفاً بیشتر توضیح بدید تا بهتر راهنماییتون کنم.",
  "این یک پاسخ نمونه است. من می‌تونم در مورد محصولات، دوره‌ها و خدمات شریف جی‌پی‌تی کمکتون کنم!",
];

export function ChatbotPanel({ open, onClose }: ChatbotPanelProps) {
  const { direction } = useDirection();
  const isRTL = direction === "rtl";
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "سلام! من دستیار هوشمند شریف جی‌پی‌تی هستم. چطور می‌تونم کمکتون کنم؟ 🤖",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Mock AI response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickSuggest = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side={isRTL ? "left" : "right"}
        className="glass border-border/50 w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="glass-strong border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-foreground">دستیار هوشمند</SheetTitle>
                <p className="text-xs text-muted-foreground">آنلاین</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-background/50"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea ref={scrollRef} className="flex-1 px-6 py-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "glass"
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
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

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="glass max-w-[80%] rounded-2xl px-4 py-2.5">
                  <div className="flex gap-1">
                    <motion.span
                      className="w-2 h-2 bg-muted-foreground rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-muted-foreground rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-muted-foreground rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="px-6 py-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">پیشنهادات سریع:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSuggest(suggestion)}
                  className="glass hover:glass-strong text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="glass-strong border-t border-border/50 px-6 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="پیام خود را بنویسید..."
              className="glass flex-1"
              dir={isRTL ? "rtl" : "ltr"}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isTyping}
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
