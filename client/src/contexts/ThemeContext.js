import React, { createContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { getTheme } from "../theme";

export const ThemeContext = createContext({
  mode: "light",
  toggleTheme: () => {},
});

export const ThemeContextProvider = ({ children }) => {
  // Check local storage or system preference
  const [mode, setMode] = useState(() => {
    try {
      const storedTheme = localStorage.getItem("app_theme");
      if (storedTheme) {
        return storedTheme;
      }
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return "dark";
      }
    } catch (e) {
      console.error("Failed to read theme from local storage", e);
    }
    return "light";
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === "light" ? "dark" : "light";
      try {
        localStorage.setItem("app_theme", nextMode);
      } catch (e) {
        console.error("Failed to save theme to local storage", e);
      }
      return nextMode;
    });
  };

  useEffect(() => {
    // Set data-theme attribute on documentElement for CSS variables
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const muiTheme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
