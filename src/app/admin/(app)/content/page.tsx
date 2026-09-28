import AdminPageChrome from "@/components/admin/AdminPageChrome";
import ContentHubClient from "@/components/admin/cms/ContentHubClient";
import {
  contentCounts,
  cutoverContentTypes,
  listContentTypes,
  upcomingContentTypes,
} from "@/lib/cms";

export const metadata = { title: "Content" };
export const dynamic = "force-dynamic";

export default async function AdminContentHubPage() {
  const types = listContentTypes();
  const counts = contentCounts();
  const upcoming = [...upcomingContentTypes()];
  const cutoverKeys = cutoverContentTypes().map((t) => t.key);

  return (
    <>
      <AdminPageChrome page="content" showDictMeta />
      <ContentHubClient
        types={types}
        counts={counts}
        upcoming={upcoming}
        cutoverKeys={cutoverKeys}
      />
    </>
  );
}
