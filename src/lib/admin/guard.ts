import { redirect } from "next/navigation";
import { getAdminPassword, isAdminAuthenticated } from "@/lib/admin/auth";

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");
  return {
    configured: Boolean(getAdminPassword()),
    /** When truthy, AdminShell shows the translated auth stub banner. */
    showAuthWarning: true as const,
    /** @deprecated alias — prefer showAuthWarning */
    warning: true as const,
  };
}
