import AdminShell from "@/components/admin/AdminShell";
import PageHeader from "@/components/admin/PageHeader";
import PipelineBoard from "@/components/admin/PipelineBoard";
import { requireAdmin } from "@/lib/admin/guard";
import { listQuotes } from "@/lib/admin/quotes-store";
import Link from "next/link";

export const metadata = { title: "Pipeline" };
export const dynamic = "force-dynamic";

export default async function AdminPipelinePage() {
  const { warning } = await requireAdmin();
  const quotes = listQuotes();

  return (
    <AdminShell warning={warning}>
      <PageHeader
        title="Pipeline"
        description="Kanban view of quote stages — drag cards or use quick advances. Same in-memory store as Quotes."
        actions={
          <Link href="/admin/quotes" className="btn-secondary-light text-sm">
            Table view
          </Link>
        }
      />
      <PipelineBoard quotes={quotes} />
    </AdminShell>
  );
}
