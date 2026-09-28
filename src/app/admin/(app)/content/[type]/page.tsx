import { notFound } from "next/navigation";
import ContentBreadcrumbs from "@/components/admin/cms/ContentBreadcrumbs";
import ContentListClient from "@/components/admin/cms/ContentListClient";
import {
  CMS_PUBLIC_ROADMAP,
  listContent,
  resolveContentType,
} from "@/lib/cms";

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

export default async function AdminContentListPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const spec = resolveContentType(type);
  if (!spec) notFound();
  const documents = listContent(type);
  const { isPublicCutover, livePaths } = cutoverMeta(type);

  return (
    <>
      <ContentBreadcrumbs
        typeLabelEn={spec.plural}
        typeLabelEs={spec.pluralEs}
      />
      <ContentListClient
        spec={spec}
        documents={documents}
        isPublicCutover={isPublicCutover}
        livePaths={livePaths}
      />
    </>
  );
}
