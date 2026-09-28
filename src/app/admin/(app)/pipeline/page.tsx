import AdminPageChrome from "@/components/admin/AdminPageChrome";
import PipelineBoard from "@/components/admin/PipelineBoard";
import { listQuotes } from "@/lib/admin/quotes-store";

export const metadata = { title: "Pipeline" };
export const dynamic = "force-dynamic";

export default async function AdminPipelinePage() {
  const quotes = listQuotes();

  return (
    <>
      <AdminPageChrome page="pipeline" />
      <PipelineBoard quotes={quotes} />
    </>
  );
}
