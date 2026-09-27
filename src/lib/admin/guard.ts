import { redirect } from "next/navigation";
import { getAdminPassword, isAdminAuthenticated } from "@/lib/admin/auth";

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");
  return {
    configured: Boolean(getAdminPassword()),
    warning:
      "Password-cookie gate for scaffolding only. Replace with real auth (Auth.js/Clerk + roles) before handling live customer data.",
  };
}
