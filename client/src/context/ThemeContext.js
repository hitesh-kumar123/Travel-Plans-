import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("themeMode");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const toggleMode = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext);
