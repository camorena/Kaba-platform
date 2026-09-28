import AdminPageChrome from "@/components/admin/AdminPageChrome";
import PriceBookPanel from "@/components/admin/PriceBookPanel";

export const metadata = { title: "Price book" };
export const dynamic = "force-dynamic";

export default async function AdminPriceBookPage() {

  return (
    <>
      <AdminPageChrome page="pricebook" showDictMeta />
      <PriceBookPanel />
    </>
  );
}
