
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translations } from '@/lib/translations';
import type { LanguageCode } from '@/lib/translations'; // Ensure this type is correctly imported/defined

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>, defaultValue?: string) => string; // Added defaultValue
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    console.log("LanguageProvider: useEffect for mount started.");
    try {
      const storedLanguage = localStorage.getItem('tahqeeqUiLanguage') as LanguageCode | null;
      console.log("LanguageProvider: Stored language from localStorage:", storedLanguage);
      if (storedLanguage && ['en', 'ur', 'ar', 'hi', 'roman-ur'].includes(storedLanguage)) {
        setCurrentLanguage(storedLanguage);
        console.log("LanguageProvider: currentLanguage set to:", storedLanguage);
      } else {
        console.log("LanguageProvider: No valid stored language found or stored language is invalid, defaulting to 'en'.");
        setCurrentLanguage('en'); // Explicitly default if not found or invalid
      }
    } catch (error) {
      console.error("LanguageProvider: Error accessing localStorage or setting language:", error);
      // Fallback to default language in case of error
      setCurrentLanguage('en');
    } finally {
      setIsMounted(true);
      console.log("LanguageProvider: isMounted set to true.");
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        console.log(`LanguageProvider: Persisting language ${currentLanguage} to localStorage and document.`);
        localStorage.setItem('tahqeeqUiLanguage', currentLanguage);
        document.documentElement.lang = currentLanguage;
        document.documentElement.dir = getDirection(currentLanguage);
      } catch (error) {
        console.error("LanguageProvider: Error updating localStorage or document attributes:", error);
      }
    }
  }, [currentLanguage, isMounted]);

  const setLanguage = useCallback((language: LanguageCode) => {
    if (['en', 'ur', 'ar', 'hi', 'roman-ur'].includes(language)) {
        setCurrentLanguage(language);
    } else {
        console.warn(`LanguageProvider: Attempted to set invalid language: ${language}`);
    }
  }, []);

  const getDirection = (lang: LanguageCode): 'ltr' | 'rtl' => {
    return (lang === 'ur' || lang === 'ar') ? 'rtl' : 'ltr';
  };

  const t = useCallback((key: string, params?: Record<string, string | number>, defaultValue?: string): string => {
    const langBundle = translations[currentLanguage] || translations.en;
    let translation = langBundle[key] || (translations.en && translations.en[key]) || defaultValue || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
      });
    }
    return translation;
  }, [currentLanguage]);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="sr-only">Loading application language...</span>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, direction: getDirection(currentLanguage) }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
