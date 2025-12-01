import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Direction = "ltr" | "rtl";

interface DirectionContextType {
  direction: Direction;
  toggleDirection: () => void;
  isRTL: boolean;
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export function DirectionProvider({ children }: { children: ReactNode }) {
  const [direction, setDirection] = useState<Direction>("ltr");

  useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
  }, [direction]);

  const toggleDirection = () => {
    setDirection((prev) => (prev === "ltr" ? "rtl" : "ltr"));
  };

  return (
    <DirectionContext.Provider
      value={{
        direction,
        toggleDirection,
        isRTL: direction === "rtl",
      }}
    >
      {children}
    </DirectionContext.Provider>
  );
}

export function useDirection() {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error("useDirection must be used within DirectionProvider");
  }
  return context;
}
