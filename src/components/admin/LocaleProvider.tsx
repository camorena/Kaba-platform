"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createTranslator,
  persistLocale,
  readStoredLocale,
  type AdminLocale,
  type TranslateVars,
} from "@/lib/admin/i18n";

type LocaleContextValue = {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: (key: string, vars?: TranslateVars) => string;
  ready: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) setLocaleState(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale === "es" ? "es-CO" : "en";
  }, [locale, ready]);

  const setLocale = useCallback((next: AdminLocale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const t = useMemo(() => createTranslator(locale), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, ready }),
    [locale, setLocale, t, ready],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useAdminI18n(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    const t = createTranslator("en");
    return {
      locale: "en",
      setLocale: () => undefined,
      t,
      ready: false,
    };
  }
  return ctx;
}
