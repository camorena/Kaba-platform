import AdminPageChrome from "@/components/admin/AdminPageChrome";
import ContentHubClient from "@/components/admin/cms/ContentHubClient";
import {
  contentCounts,
  listContentTypes,
  upcomingContentTypes,
} from "@/lib/cms";

export const metadata = { title: "Content" };
export const dynamic = "force-dynamic";

export default async function AdminContentHubPage() {
  const types = listContentTypes();
  const counts = contentCounts();
  const upcoming = [...upcomingContentTypes()];

  return (
    <>
      <AdminPageChrome page="content" showDictMeta />
      <ContentHubClient types={types} counts={counts} upcoming={upcoming} />
    </>
  );
}
