import AdminShell from "@/components/admin/AdminShell";
import AdminPageChrome from "@/components/admin/AdminPageChrome";
import PipelineBoard from "@/components/admin/PipelineBoard";
import { requireAdmin } from "@/lib/admin/guard";
import { listQuotes } from "@/lib/admin/quotes-store";

export const metadata = { title: "Pipeline" };
export const dynamic = "force-dynamic";

export default async function AdminPipelinePage() {
  const { warning } = await requireAdmin();
  const quotes = listQuotes();

  return (
    <AdminShell warning={warning}>
      <AdminPageChrome page="pipeline" />
      <PipelineBoard quotes={quotes} />
    </AdminShell>
  );
}
