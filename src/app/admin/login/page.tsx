import { redirect } from "next/navigation";
import LoginPageClient from "@/components/admin/LoginPageClient";
import {
  getAuthMode,
  isAdminAuthenticated,
  isAuthConfigured,
} from "@/lib/admin/auth";

export const metadata = {
  title: "Admin login",
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const authMode = getAuthMode();

  return (
    <LoginPageClient
      configured={isAuthConfigured()}
      authMode={authMode}
    />
  );
}
