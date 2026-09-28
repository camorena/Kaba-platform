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

function formatCutoverPaths(paths: string[]): string {
  return paths
    .map((p) => (p === "/" ? "home" : p))
    .join(", ");
}

export default async function AdminContentHubPage() {
  const types = listContentTypes();
  const counts = contentCounts();
  const upcoming = [...upcomingContentTypes()];
  const cutoverLabels: Record<string, string> = {};
  for (const item of cutoverContentTypes()) {
    cutoverLabels[item.key] = formatCutoverPaths([...item.publicPaths]);
  }

  return (
    <>
      <AdminPageChrome page="content" showDictMeta />
      <ContentHubClient
        types={types}
        counts={counts}
        upcoming={upcoming}
        cutoverLabels={cutoverLabels}
      />
    </>
  );
}
