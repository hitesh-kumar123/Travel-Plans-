import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "./theme";

const ThemeContext = createContext();

// Preference options: "light" | "dark" | "system"
const STORAGE_KEY = "packgo-theme-preference";

/**
 * Reads the OS-level color scheme preference.
 * Returns "dark" or "light".
 */
function getSystemMode() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Resolves the effective mode from the user preference.
 * "system" → reads OS setting.  Otherwise returns the stored value.
 */
function resolveMode(preference) {
  if (preference === "system") return getSystemMode();
  return preference;
}

export function ThemeContextProvider({ children }) {
  // "light" | "dark" | "system"
  const [preference, setPreference] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
    } catch {
      // localStorage unavailable
    }
    return "system"; // default: follow OS
  });

  const [effectiveMode, setEffectiveMode] = useState(() =>
    resolveMode(preference),
  );

  // Persist preference changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // ignore
    }
    setEffectiveMode(resolveMode(preference));
  }, [preference]);

  // Listen for OS theme changes (only matters when preference === "system")
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (preference === "system") {
        setEffectiveMode(getSystemMode());
      }
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [preference]);

  // Apply a data attribute on <html> so CSS can target dark mode
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", effectiveMode);
  }, [effectiveMode]);

  const theme = useMemo(() => getTheme(effectiveMode), [effectiveMode]);

  /**
   * Cycles through: light → dark → system → light …
   * Or simply toggles between light and dark if you prefer.
   */
  const toggleTheme = () => {
    setPreference((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light"; // system → light
    });
  };

  /**
   * Sets the preference directly to "light", "dark", or "system".
   */
  const setThemePreference = (pref) => {
    if (pref === "light" || pref === "dark" || pref === "system") {
      setPreference(pref);
    }
  };

  const contextValue = useMemo(
    () => ({
      mode: effectiveMode, // "light" | "dark"
      preference, // "light" | "dark" | "system"
      toggleTheme, // cycles light → dark → system
      setThemePreference, // set directly
      isDark: effectiveMode === "dark",
    }),
    [effectiveMode, preference],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme mode controls from any component.
 *
 * Usage:
 *   const { mode, preference, toggleTheme, setThemePreference, isDark } = useThemeMode();
 */
export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within a ThemeContextProvider");
  }
  return ctx;
}

export default ThemeContext;
