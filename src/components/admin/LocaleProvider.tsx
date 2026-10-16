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
  DEFAULT_ADMIN_LOCALE,
  persistLocale,
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

/**
 * initialLocale comes from the locale cookie, read on the server in
 * app/admin/layout.tsx — so the first paint is already in the right language.
 */
export function AdminLocaleProvider({
  children,
  initialLocale = DEFAULT_ADMIN_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: AdminLocale;
}) {
  const [locale, setLocaleState] = useState<AdminLocale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale === "es" ? "es-CO" : "en";
  }, [locale]);

  const setLocale = useCallback((next: AdminLocale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const t = useMemo(() => createTranslator(locale), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, ready: true }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useAdminI18n(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    const t = createTranslator(DEFAULT_ADMIN_LOCALE);
    return {
      locale: DEFAULT_ADMIN_LOCALE,
      setLocale: () => undefined,
      t,
      ready: false,
    };
  }
  return ctx;
}
