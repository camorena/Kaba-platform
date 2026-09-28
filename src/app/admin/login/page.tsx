import { redirect } from "next/navigation";
import LoginPageClient from "@/components/admin/LoginPageClient";
import { getAdminPassword, isAdminAuthenticated } from "@/lib/admin/auth";

export const metadata = {
  title: "Admin login",
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return <LoginPageClient configured={Boolean(getAdminPassword())} />;
}
