import AdminShell from "@/components/admin/AdminShell";
import AdminPageChrome from "@/components/admin/AdminPageChrome";
import TemplatesPanel from "@/components/admin/TemplatesPanel";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata = { title: "Templates" };
export const dynamic = "force-dynamic";

export default async function AdminTemplatesPage() {
  const { warning } = await requireAdmin();

  return (
    <AdminShell warning={warning}>
      <AdminPageChrome page="templates" showDictMeta />
      <TemplatesPanel />
    </AdminShell>
  );
}
