import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminLocaleProvider } from "@/components/admin/LocaleProvider";
import {
  DEFAULT_ADMIN_LOCALE,
  isAdminLocale,
  LOCALE_COOKIE,
} from "@/lib/admin/i18n";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · Kaba Admin",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side locale: cookie set by the language switch, else Spanish (es-CO).
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value;
  const initialLocale = isAdminLocale(stored) ? stored : DEFAULT_ADMIN_LOCALE;

  return (
    <AdminLocaleProvider initialLocale={initialLocale}>
      <div
        lang={initialLocale === "es" ? "es-CO" : "en"}
        className="min-h-full flex-1 bg-background text-foreground"
      >
        {children}
      </div>
    </AdminLocaleProvider>
  );
}
