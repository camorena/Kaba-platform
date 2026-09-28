export type AdminLocale = "en" | "es";

export const ADMIN_LOCALES: AdminLocale[] = ["en", "es"];

export const LOCALE_STORAGE_KEY = "kaba-admin-locale";
export const LOCALE_COOKIE = "kaba_admin_locale";

export type TranslateVars = Record<string, string | number>;

/** Nested string leaf dictionary — values are strings or nested objects of the same shape. */
export type DictNode = { [key: string]: string | DictNode };
