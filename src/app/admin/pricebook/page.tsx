import AdminShell from "@/components/admin/AdminShell";
import PageHeader from "@/components/admin/PageHeader";
import PriceBookPanel from "@/components/admin/PriceBookPanel";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata = { title: "Price book" };
export const dynamic = "force-dynamic";

export default async function AdminPriceBookPage() {
  const { warning } = await requireAdmin();

  return (
    <AdminShell warning={warning}>
      <PageHeader
        title="Price book"
        description="Field rates for ballpark estimates. Edits stay in your browser (localStorage) — no Stripe, no database."
        meta={
          <p className="mb-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-bronze">
            Estimating · offline
          </p>
        }
      />
      <PriceBookPanel />
    </AdminShell>
  );
}
