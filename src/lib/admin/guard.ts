import { redirect } from "next/navigation";
import { getAuthMode, isAuthConfigured } from "@/lib/admin/auth";
import { getCurrentAdmin } from "@/lib/admin/dal";

export async function requireAdmin() {
  const user = await getCurrentAdmin();
  if (!user) redirect("/admin/login");
  const mode = getAuthMode();
  return {
    configured: isAuthConfigured(),
    admin: user,
    /**
     * Banner for stub mode. Credentials mode still shows a softer note via
     * AdminShell when we pass showAuthWarning — keep true for stub only so
     * operators see the password gate is not production auth.
     */
    showAuthWarning: (mode === "stub") as boolean,
    /** @deprecated alias — prefer showAuthWarning */
    warning: mode === "stub",
  };
}
