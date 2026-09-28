/**
 * Memory CMS store — seeded from site.ts mirrors.
 * Edits persist in-process only (reset on cold start). SQL migration optional.
 */

import "server-only";

import { resolveContentType } from "@/lib/cms/content-types";
import type { ContentDocument, ContentFieldValue } from "@/lib/cms/types";
import {
  deckServices,
  faqs,
  fencingServices,
  galleryProjects,
} from "@/lib/site";

let store: Map<string, ContentDocument[]> | null = null;

function nowIso(): string {
  return new Date().toISOString();
}

function seed(): Map<string, ContentDocument[]> {
  const map = new Map<string, ContentDocument[]>();

  map.set(
    "fence-types",
    fencingServices.map((s, i) => ({
      id: `ft_${s.slug}`,
      type: "fence-types",
      status: "published" as const,
      sortOrder: i + 1,
      updatedAt: nowIso(),
      fields: {
        name: s.title,
        slug: s.slug,
        tagline: s.tagline,
        summary: s.summary,
        details: s.details,
        image: s.image,
        audience: "both",
        sortOrder: i + 1,
      },
    })),
  );

  map.set(
    "services",
    deckServices.map((s, i) => ({
      id: `svc_${s.slug}`,
      type: "services",
      status: "published" as const,
      sortOrder: i + 1,
      updatedAt: nowIso(),
      fields: {
        name: s.title,
        slug: s.slug,
        summary: s.summary,
        details: s.details,
        audience: "residential",
        sortOrder: i + 1,
      },
    })),
  );

  map.set(
    "projects",
    galleryProjects.map((p, i) => ({
      id: `proj_${p.id}`,
      type: "projects",
      status: "published" as const,
      sortOrder: i + 1,
      updatedAt: nowIso(),
      fields: {
        title: p.title,
        slug: p.id,
        category: p.category,
        caption: p.caption,
        image: p.image,
        city: "",
        isFeatured: i < 3,
        sortOrder: i + 1,
      },
    })),
  );

  map.set(
    "faqs",
    faqs.map((f, i) => ({
      id: `faq_${i + 1}`,
      type: "faqs",
      status: "published" as const,
      sortOrder: i + 1,
      updatedAt: nowIso(),
      fields: {
        question: f.question,
        answer: f.answer,
        category: "general",
        sortOrder: i + 1,
      },
    })),
  );

  return map;
}

function ensure(): Map<string, ContentDocument[]> {
  if (!store) store = seed();
  return store;
}

function sortDocs(type: string, docs: ContentDocument[]): ContentDocument[] {
  const spec = resolveContentType(type);
  const key = spec?.orderBy ?? "sortOrder";
  return [...docs].sort((a, b) => {
    const av = (a.fields[key] ?? a.sortOrder) as number;
    const bv = (b.fields[key] ?? b.sortOrder) as number;
    return Number(av) - Number(bv);
  });
}

export function listContent(type: string): ContentDocument[] {
  if (!resolveContentType(type)) return [];
  const docs = ensure().get(type) ?? [];
  return sortDocs(type, docs);
}

export function getContent(type: string, id: string): ContentDocument | null {
  if (!resolveContentType(type)) return null;
  const docs = ensure().get(type) ?? [];
  return docs.find((d) => d.id === id) ?? null;
}

export function updateContent(
  type: string,
  id: string,
  patch: {
    status?: "draft" | "published";
    fields?: Record<string, ContentFieldValue>;
  },
): ContentDocument | null {
  const spec = resolveContentType(type);
  if (!spec) return null;
  const docs = ensure().get(type) ?? [];
  const idx = docs.findIndex((d) => d.id === id);
  if (idx < 0) return null;

  const current = docs[idx];
  const nextFields = { ...current.fields };
  if (patch.fields) {
    for (const field of spec.fields) {
      if (!(field.name in patch.fields)) continue;
      if (field.locked) continue;
      let value = patch.fields[field.name];
      if (field.kind === "number" && value !== null && value !== undefined) {
        value = Number(value);
        if (!Number.isFinite(value)) value = current.fields[field.name] ?? 0;
      }
      if (field.kind === "checkbox") {
        value = Boolean(value);
      }
      if (typeof value === "string" && field.maxLength) {
        value = value.slice(0, field.maxLength);
      }
      nextFields[field.name] = value as ContentFieldValue;
    }
  }

  const sortOrder =
    typeof nextFields.sortOrder === "number"
      ? nextFields.sortOrder
      : current.sortOrder;

  const updated: ContentDocument = {
    ...current,
    status: patch.status ?? current.status,
    sortOrder,
    updatedAt: nowIso(),
    fields: nextFields,
  };
  docs[idx] = updated;
  ensure().set(type, docs);
  return updated;
}

export function contentCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, docs] of ensure()) {
    out[key] = docs.length;
  }
  return out;
}
