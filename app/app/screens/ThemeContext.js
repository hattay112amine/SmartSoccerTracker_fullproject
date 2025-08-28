import React, { createContext, useState, useEffect } from "react";
import { Appearance } from "react-native";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme(); // détecte le thème système
  const [theme, setTheme] = useState(colorScheme || "light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
