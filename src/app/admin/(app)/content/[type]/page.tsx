import { notFound } from "next/navigation";
import AdminPageChrome from "@/components/admin/AdminPageChrome";
import ContentListClient from "@/components/admin/cms/ContentListClient";
import { listContent, resolveContentType } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const spec = resolveContentType(type);
  return { title: spec ? spec.plural : "Content" };
}

export default async function AdminContentListPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const spec = resolveContentType(type);
  if (!spec) notFound();
  const documents = listContent(type);

  return (
    <>
      <AdminPageChrome page="content" showDictMeta />
      <ContentListClient spec={spec} documents={documents} />
    </>
  );
}
