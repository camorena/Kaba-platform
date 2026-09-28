import type { Metadata } from "next";
import { AdminLocaleProvider } from "@/components/admin/LocaleProvider";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · Kaba Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLocaleProvider>
      <div className="min-h-full flex-1 bg-background text-foreground">
        {children}
      </div>
    </AdminLocaleProvider>
  );
}
