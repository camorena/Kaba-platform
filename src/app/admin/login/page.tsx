import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import SiteCredit from "@/components/SiteCredit";
import ThemeToggle from "@/components/ThemeToggle";
import { getAdminPassword, isAdminAuthenticated } from "@/lib/admin/auth";

export const metadata = {
  title: "Admin login",
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="admin-app relative mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-bronze via-bronze-light to-bronze" aria-hidden />
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-5">
        <ThemeToggle />
      </div>
      <div
        role="status"
        className="mb-6 rounded-lg border border-amber-700/30 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-950 dark:border-amber-400/25 dark:bg-amber-950/40 dark:text-amber-100"
      >
        <strong className="font-semibold">Auth stub — not production-ready.</strong>{" "}
        Shared password cookie only. Replace before handling live customer data.
      </div>
      <div className="mb-8 text-center">
        <Image
          src="/brand/kaba-fence-icon.png"
          alt=""
          width={48}
          height={48}
          className="mx-auto h-12 w-12 object-contain"
        />
        <p className="mt-4 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-bronze">
          Kaba Fence
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
          Admin sign-in
        </h1>
        <p className="mt-2 text-sm text-muted">
          Quotes, invoices, and payments foundation.
        </p>
      </div>
      <div className="admin-glass-panel border-bronze/20 p-5 sm:p-6 shadow-[var(--shadow-md)]">
        <LoginForm configured={Boolean(getAdminPassword())} />
      </div>
      <p className="mt-6 text-center text-xs text-muted">
        <Link href="/" className="underline-offset-2 hover:underline">
          ← Back to public site
        </Link>
      </p>
      <footer className="mt-8 border-t border-ink/8 pt-5 text-center">
        <SiteCredit tone="admin" />
      </footer>
    </div>
  );
}
