"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: string;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: string) => void;
  themes: string[];
  systemTheme?: "dark" | "light";
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  enableColorScheme?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "theme",
  enableSystem = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<string>(defaultTheme);
  const [systemTheme, setSystemTheme] = React.useState<"dark" | "light">("dark");
  const [mounted, setMounted] = React.useState(false);

  // Determine system theme
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    };
    updateSystemTheme();
    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  // Initialize from storage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setThemeState(saved);
      }
    } catch {
      // localStorage may be disabled
    }
    setMounted(true);
  }, [storageKey]);

  // Listen for storage changes across tabs
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        setThemeState(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey]);

  const resolvedTheme: "dark" | "light" = React.useMemo(() => {
    if (theme === "system") {
      return enableSystem ? systemTheme : "dark";
    }
    return theme === "light" ? "light" : "dark";
  }, [theme, systemTheme, enableSystem]);

  // Apply class and color-scheme to documentElement
  React.useEffect(() => {
    if (!mounted || typeof document === "undefined") return;

    const root = document.documentElement;
    if (resolvedTheme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    }
  }, [resolvedTheme, mounted]);

  const setTheme = React.useCallback(
    (newTheme: string) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // localStorage may be disabled
      }
    },
    [storageKey]
  );

  const value = React.useMemo<ThemeContextType>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      themes: ["dark", "light", "system"],
      systemTheme,
    }),
    [theme, resolvedTheme, setTheme, systemTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = React.useContext(ThemeContext);
  if (!context) {
    // Fallback if rendered outside ThemeProvider
    return {
      theme: "dark",
      resolvedTheme: "dark",
      setTheme: () => {},
      themes: ["dark", "light", "system"],
      systemTheme: "dark",
    };
  }
  return context;
}
