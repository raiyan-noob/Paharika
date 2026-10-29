"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("paharika-lang");
      if (saved === "bn" || saved === "en") {
        setLanguage(saved);
      }
    } catch (e) {
      // Ignore localStorage read errors
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === "en" ? "bn" : "en";
      try {
        localStorage.setItem("paharika-lang", next);
      } catch (e) {
        // Ignore localStorage write errors
      }
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en",
      setLanguage: () => {},
      toggleLanguage: () => {},
    };
  }
  return context;
};
