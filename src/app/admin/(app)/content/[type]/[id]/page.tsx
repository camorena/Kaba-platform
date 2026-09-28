import { notFound } from "next/navigation";
import ContentBreadcrumbs from "@/components/admin/cms/ContentBreadcrumbs";
import ContentEditClient from "@/components/admin/cms/ContentEditClient";
import {
  CMS_PUBLIC_ROADMAP,
  getContent,
  resolveContentType,
} from "@/lib/cms";

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

function cutoverMeta(type: string): { isPublicCutover: boolean; livePaths: string } {
  const planned = CMS_PUBLIC_ROADMAP.find((t) => t.key === type);
  if (!planned?.publicCutover) {
    return { isPublicCutover: false, livePaths: "" };
  }
  const livePaths = planned.publicPaths
    .map((p) => (p === "/" ? "home" : p))
    .join(", ");
  return { isPublicCutover: true, livePaths };
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
  const { isPublicCutover, livePaths } = cutoverMeta(type);
  const docLabel = String(document.fields[spec.titleField] ?? id);

  return (
    <>
      <ContentBreadcrumbs
        typeLabelEn={spec.plural}
        typeLabelEs={spec.pluralEs}
        typeHref={`/admin/content/${spec.key}`}
        docLabel={docLabel}
      />
      <ContentEditClient
        spec={spec}
        document={document}
        isPublicCutover={isPublicCutover}
        livePaths={livePaths}
      />
    </>
  );
}
