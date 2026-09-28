import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/guard";

/**
 * Persistent admin chrome for authenticated routes.
 * Login lives outside this group so the shell does not remount on in-app nav.
 */
export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showAuthWarning } = await requireAdmin();

  return (
    <AdminShell showAuthWarning={showAuthWarning}>{children}</AdminShell>
  );
}
