import React, { createContext, useState, useContext } from "react";

// Context 생성
const LanguageContext = createContext();

// Context Provider 컴포넌트
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en"); // 기본값: 한국어

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Context 소비 Hook
export function useLanguage() {
  return useContext(LanguageContext);
}
