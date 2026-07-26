import React, { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

function ThemeProvider(props) {
  let savedTheme = localStorage.getItem("theme");

  const [darkMode, setDarkMode] = useState(
    savedTheme === "dark" ? true : false,
  );

  useEffect(() => {
    if (darkMode === true) {
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [darkMode]);

  function toggleTheme() {
    if (darkMode === true) {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;

export function useTheme() {
  return useContext(ThemeContext);
}
