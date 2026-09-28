import AdminShell from "@/components/admin/AdminShell";
import AdminPageChrome from "@/components/admin/AdminPageChrome";
import { I18nActionLink } from "@/components/admin/I18nLink";
import QuotesTable from "@/components/admin/QuotesTable";
import { requireAdmin } from "@/lib/admin/guard";
import { listQuotes } from "@/lib/admin/quotes-store";

export const metadata = { title: "Quotes" };
export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const { warning } = await requireAdmin();
  const quotes = listQuotes();

  return (
    <AdminShell warning={warning}>
      <AdminPageChrome
        page="quotes"
        actions={
          <I18nActionLink
            href="/admin/pipeline"
            labelKey="common.pipelineBoard"
            className="btn-secondary-light text-sm"
          />
        }
      />
      <QuotesTable quotes={quotes} />
    </AdminShell>
  );
}
