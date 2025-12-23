import React, { createContext, useContext, useState } from 'react';
import { Language } from '../types';
import { translations as initialTranslations } from '../translations';

type TranslationsType = typeof initialTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof initialTranslations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  translations?: TranslationsType;
}> = ({ children, translations = initialTranslations }) => {
  // Initialize from localStorage if available
  const getInitialLanguage = (): Language => {
    const stored = localStorage.getItem('selectedLanguage');
    if (stored === 'zh' || stored === 'en') return stored;
    return 'en';
  };
  const [language, setLanguageState] = useState<Language>(getInitialLanguage());

  // Update localStorage when language changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
