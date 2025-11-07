import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:border-primary/50 hover:bg-white/15 transition-all duration-200 shadow-lg flex items-center justify-center"
      aria-label="تغییر تم"
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5 text-amber-500 animate-in fade-in duration-300" />
      ) : (
        <Moon className="h-3.5 w-3.5 text-blue-400 animate-in fade-in duration-300" />
      )}
    </button>
  );
}
