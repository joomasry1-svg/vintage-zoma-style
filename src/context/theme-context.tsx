import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type SiteTheme = "obsidian" | "ivory";

const STORAGE_KEY = "zoma-theme";

type ThemeContextValue = {
  theme: SiteTheme;
  setTheme: (theme: SiteTheme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function initialTheme(): SiteTheme {
  if (typeof window === "undefined") return "ivory";
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "obsidian"
      ? "obsidian"
      : "ivory";
  } catch {
    return "ivory";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>(initialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-ivory", theme === "ivory");
    root.style.colorScheme = theme === "ivory" ? "light" : "dark";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "ivory" ? "#fbf7f2" : "#0d0d0d");
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage can be unavailable in private frames; the UI still works.
    }
  }, [theme]);

  const setTheme = useCallback((next: SiteTheme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "ivory" ? "obsidian" : "ivory"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
