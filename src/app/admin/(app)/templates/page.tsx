import AdminPageChrome from "@/components/admin/AdminPageChrome";
import TemplatesPanel from "@/components/admin/TemplatesPanel";

export const metadata = { title: "Templates" };
export const dynamic = "force-dynamic";

export default async function AdminTemplatesPage() {

  return (
    <>
      <AdminPageChrome page="templates" showDictMeta />
      <TemplatesPanel />
    </>
  );
}
