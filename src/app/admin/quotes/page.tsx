import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import PageHeader from "@/components/admin/PageHeader";
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
      <PageHeader
        title="Quotes"
        description="Public form submissions plus seed demo rows. In-memory store — resets on serverless cold starts until a DB is wired."
        crumbs={[
          { href: "/admin", label: "Admin" },
          { label: "Quotes" },
        ]}
        actions={
          <Link href="/admin/pipeline" className="btn-secondary-light text-sm">
            Pipeline board
          </Link>
        }
      />
      <QuotesTable quotes={quotes} />
    </AdminShell>
  );
}
