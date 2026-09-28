import AdminShell from "@/components/admin/AdminShell";
import PageHeader from "@/components/admin/PageHeader";
import TemplatesPanel from "@/components/admin/TemplatesPanel";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata = { title: "Templates" };
export const dynamic = "force-dynamic";

export default async function AdminTemplatesPage() {
  const { warning } = await requireAdmin();

  return (
    <AdminShell warning={warning}>
      <PageHeader
        title="Follow-up templates"
        description="SMS, email, and internal note starters with merge fields. Copy to clipboard — no paid messaging API."
        meta={
          <p className="mb-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-bronze">
            Ops · copy & paste
          </p>
        }
      />
      <TemplatesPanel />
    </AdminShell>
  );
}
