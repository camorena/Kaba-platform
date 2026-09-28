import en from "./en";
import es from "./es";
import type { AdminLocale, DictNode, TranslateVars } from "./types";
import {
  ADMIN_LOCALES,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
} from "./types";

export type { AdminLocale, TranslateVars } from "./types";
export {
  ADMIN_LOCALES,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
} from "./types";

const dictionaries: Record<AdminLocale, DictNode> = {
  en: en as unknown as DictNode,
  es: es as unknown as DictNode,
};

export function isAdminLocale(value: string | null | undefined): value is AdminLocale {
  return value === "en" || value === "es";
}

export function getDictionary(locale: AdminLocale): DictNode {
  return dictionaries[locale] ?? dictionaries.en;
}

function lookup(dict: DictNode, path: string): string | undefined {
  const parts = path.split(".");
  let cur: string | DictNode | undefined = dict;
  for (const p of parts) {
    if (!cur || typeof cur === "string") return undefined;
    cur = cur[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

export function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = vars[key];
    return v === undefined || v === null ? `{${key}}` : String(v);
  });
}

/** Resolve plural key: if vars.count !== 1 and `${key}_plural` exists, use it. */
export function translate(
  locale: AdminLocale,
  key: string,
  vars?: TranslateVars,
): string {
  const dict = getDictionary(locale);
  const count = vars?.count;
  if (typeof count === "number" && count !== 1) {
    const plural = lookup(dict, `${key}_plural`);
    if (plural) return interpolate(plural, vars);
  }
  const primary = lookup(dict, key);
  if (primary) return interpolate(primary, vars);
  // Fallback to English
  if (locale !== "en") {
    const enVal = lookup(getDictionary("en"), key);
    if (enVal) return interpolate(enVal, vars);
  }
  return key;
}

export function createTranslator(locale: AdminLocale) {
  return (key: string, vars?: TranslateVars) => translate(locale, key, vars);
}

export function quoteStatusLabel(locale: AdminLocale, status: string): string {
  return translate(locale, `status.quote.${status}`);
}

export function invoiceStatusLabel(locale: AdminLocale, status: string): string {
  return translate(locale, `status.invoice.${status}`);
}

export function paymentStatusLabel(locale: AdminLocale, status: string): string {
  return translate(locale, `status.payment.${status}`);
}

export function paymentMethodLabel(locale: AdminLocale, method: string): string {
  return translate(locale, `status.method.${method}`);
}

export function persistLocale(locale: AdminLocale) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${maxAge};SameSite=Lax`;
}

export function readStoredLocale(): AdminLocale | null {
  if (typeof window === "undefined") return null;
  try {
    const fromLs = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isAdminLocale(fromLs)) return fromLs;
  } catch {
    /* ignore */
  }
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`),
  );
  const fromCookie = match?.[1];
  if (isAdminLocale(fromCookie)) return fromCookie;
  return null;
}

export function navLabelKey(href: string): string {
  const map: Record<string, string> = {
    "/admin": "nav.dashboard",
    "/admin/quotes": "nav.quotes",
    "/admin/pipeline": "nav.pipeline",
    "/admin/invoices": "nav.invoices",
    "/admin/payments": "nav.payments",
    "/admin/customers": "nav.customers",
    "/admin/calendar": "nav.schedule",
    "/admin/pricebook": "nav.pricebook",
    "/admin/templates": "nav.templates",
    "/admin/activity": "nav.activity",
    "/admin/reports": "nav.reports",
    "/admin/settings": "nav.settings",
  };
  return map[href] ?? "nav.admin";
}

export { ADMIN_LOCALES as locales };
