import { notFound } from "next/navigation";
import AdminPageChrome from "@/components/admin/AdminPageChrome";
import ContentEditClient from "@/components/admin/cms/ContentEditClient";
import { getContent, resolveContentType } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const spec = resolveContentType(type);
  const doc = spec ? getContent(type, id) : null;
  const titleField = spec?.titleField ?? "name";
  const title =
    doc && spec
      ? String(doc.fields[titleField] ?? id)
      : "Content";
  return { title };
}

export default async function AdminContentEditPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  const spec = resolveContentType(type);
  if (!spec) notFound();
  const document = getContent(type, id);
  if (!document) notFound();

  return (
    <>
      <AdminPageChrome page="content" showDictMeta />
      <ContentEditClient spec={spec} document={document} />
    </>
  );
}
