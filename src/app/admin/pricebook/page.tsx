import AdminShell from "@/components/admin/AdminShell";
import AdminPageChrome from "@/components/admin/AdminPageChrome";
import PriceBookPanel from "@/components/admin/PriceBookPanel";
import { requireAdmin } from "@/lib/admin/guard";

export const metadata = { title: "Price book" };
export const dynamic = "force-dynamic";

export default async function AdminPriceBookPage() {
  const { warning } = await requireAdmin();

  return (
    <AdminShell warning={warning}>
      <AdminPageChrome page="pricebook" showDictMeta />
      <PriceBookPanel />
    </AdminShell>
  );
}
