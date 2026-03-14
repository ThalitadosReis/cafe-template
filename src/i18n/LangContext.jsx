import { createContext, useContext, useState } from "react";
import { en } from "./translations/en.js";
import { de } from "./translations/de.js";

const LangContext = createContext();
const translations = { en, de };

export function LangProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
