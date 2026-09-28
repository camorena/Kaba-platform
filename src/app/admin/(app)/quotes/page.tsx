import AdminPageChrome from "@/components/admin/AdminPageChrome";
import { I18nActionLink } from "@/components/admin/I18nLink";
import QuotesTable from "@/components/admin/QuotesTable";
import { listQuotes } from "@/lib/admin/quotes-store";

export const metadata = { title: "Quotes" };
export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const quotes = await listQuotes();

  return (
    <>
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
    </>
  );
}
