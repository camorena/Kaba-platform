import AdminShell from "@/components/admin/AdminShell";
import SettingsClient from "@/components/admin/SettingsClient";
import { getAdminPassword } from "@/lib/admin/auth";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { warning } = await requireAdmin();
  const configured = Boolean(getAdminPassword());

  return (
    <AdminShell warning={warning}>
      <SettingsClient configured={configured} />
    </AdminShell>
  );
}
