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
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
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
          Scaffold gate for quotes, invoices, and payments.
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
