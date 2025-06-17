"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  SupportedLanguage,
  LanguageOption,
  TranslationData,
} from "@/types/language";

export type Language = "ko" | "en" | "ja" | "zh";

export const supportedLanguages = [
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
] as const;

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>, namespace?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const getInitialLanguage = (): Language => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || "ko";
    }
    return "ko";
  };
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    getInitialLanguage()
  );
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem("language", lang);
    setTranslations({}); // 번역 캐시 초기화
  };

  const loadTranslations = async (namespace: string) => {
    try {
      const response = await fetch(
        `/locales/${currentLanguage}/${namespace}.json`
      );
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${namespace}`);
      }
      const data = await response.json();
      setTranslations((prev) => ({
        ...prev,
        [namespace]: data,
      }));
    } catch (error) {
      console.error(`Error loading translations for ${namespace}:`, error);
    }
  };

  const t = (
    key: string,
    params?: Record<string, any>,
    namespace: string = "common"
  ) => {
    if (isLoading) {
      return key;
    }

    const namespaceTranslations = translations[namespace];
    if (!namespaceTranslations) {
      loadTranslations(namespace);
      return key;
    }

    const keys = key.split(".");
    let value = namespaceTranslations;
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    if (typeof value === "string") {
      if (params) {
        return value.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? "");
      }
      return value;
    }
    return key;
  };

  useEffect(() => {
    const loadInitialTranslations = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          loadTranslations("common"),
          loadTranslations("menu"),
        ]);
      } catch (error) {
        console.error("Error loading initial translations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTranslations();
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(namespace: string = "common") {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }

  return {
    t: (key: string, params?: Record<string, any>) =>
      context.t(key, params, namespace),
  };
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return {
    currentLanguage: context.currentLanguage,
    setLanguage: context.setLanguage,
  };
}
