import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getAdminPassword, isAdminAuthenticated } from "@/lib/admin/auth";

export const metadata = {
  title: "Admin login",
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="admin-app mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
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
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
          Admin sign-in
        </h1>
        <p className="mt-2 text-sm text-muted">
          Quotes, invoices, and payments foundation.
        </p>
      </div>
      <div className="card-static p-5 sm:p-6">
        <LoginForm configured={Boolean(getAdminPassword())} />
      </div>
      <p className="mt-6 text-center text-xs text-muted">
        <Link href="/" className="underline-offset-2 hover:underline">
          ← Back to public site
        </Link>
      </p>
    </div>
  );
}
