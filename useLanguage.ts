import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, LANGUAGES, translations } from '@shared/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mzansi-language') as Language;
    setLanguageState(saved || 'en');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('mzansi-language', language);
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const trans = translations[language];
    if (!trans) return key;
    return trans[key] || key;
  };

  if (!mounted) return children;

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    languages: LANGUAGES,
  };

  return React.createElement(
    LanguageContext.Provider,
    { value },
    children
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
