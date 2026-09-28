/**
 * Public CMS readers — safe partial cutover helpers.
 *
 * Prefer site.ts fallback when CMS has no published docs.
 * Only wire marketing pages that have been explicitly cut over.
 */

import "server-only";

import { listContent } from "@/lib/cms/memory-store";
import type {
  PublishedAudience,
  PublishedFaq,
  PublishedFenceType,
  PublishedProject,
  PublishedService,
  PublishedTestimonial,
} from "@/lib/cms/types";
import {
  deckServices as siteDeckServices,
  faqs as siteFaqs,
  fencingServices as siteFenceTypes,
  galleryProjects as siteProjects,
  testimonials as siteTestimonials,
} from "@/lib/site";

export type {
  PublishedAudience,
  PublishedFaq,
  PublishedFenceType,
  PublishedProject,
  PublishedService,
  PublishedTestimonial,
};

function parseAudience(raw: string): PublishedAudience {
  if (raw === "residential" || raw === "commercial") return raw;
  return "both";
}

function matchesAudience(
  audience: PublishedAudience,
  filter?: "residential" | "commercial",
): boolean {
  if (!filter) return true;
  return audience === "both" || audience === filter;
}

/**
 * Live FAQ reader for /faq (+ JSON-LD).
 * Uses published CMS faqs when present; otherwise site.ts.
 * Chatbot still imports site.ts directly (no cutover yet).
 */
export function getPublishedFaqs(): PublishedFaq[] {
  const docs = listContent("faqs").filter((d) => d.status === "published");
  const fromCms = docs
    .map((d) => ({
      question: String(d.fields.question ?? "").trim(),
      answer: String(d.fields.answer ?? "").trim(),
    }))
    .filter((f) => f.question.length > 0 && f.answer.length > 0);

  if (fromCms.length > 0) return fromCms;

  return siteFaqs.map((f) => ({ question: f.question, answer: f.answer }));
}

/** True when /faq is reading CMS published rows. */
export function faqsSourceIsCms(): boolean {
  return listContent("faqs").some((d) => d.status === "published");
}

/**
 * Live testimonials for /reviews + home teaser.
 * Published CMS → else site.ts. No star ratings (claims honesty).
 */
export function getPublishedTestimonials(): PublishedTestimonial[] {
  const docs = listContent("testimonials").filter(
    (d) => d.status === "published",
  );
  const fromCms = docs
    .map((d) => ({
      quote: String(d.fields.quote ?? "").trim(),
      name: String(d.fields.name ?? "").trim(),
      town: String(d.fields.town ?? "").trim(),
    }))
    .filter((t) => t.quote.length > 0 && t.name.length > 0 && t.town.length > 0);

  if (fromCms.length > 0) return fromCms;

  return siteTestimonials.map((t) => ({
    quote: t.quote,
    name: t.name,
    town: t.town,
  }));
}

export function testimonialsSourceIsCms(): boolean {
  return listContent("testimonials").some((d) => d.status === "published");
}

/**
 * Live gallery/projects for /gallery (+ home work teaser).
 * Published CMS → else site.ts. beforeImage optional for before/after.
 */
export function getPublishedProjects(): PublishedProject[] {
  const docs = listContent("projects").filter((d) => d.status === "published");
  const fromCms = docs
    .map((d) => {
      const categoryRaw = String(d.fields.category ?? "fence").trim();
      const category: "fence" | "deck" =
        categoryRaw === "deck" ? "deck" : "fence";
      const slug = String(d.fields.slug ?? d.id).trim();
      const image = String(d.fields.image ?? "").trim();
      const title = String(d.fields.title ?? "").trim();
      const caption = String(d.fields.caption ?? "").trim();
      const beforeImage = String(d.fields.beforeImage ?? "").trim();
      const beforeCaption = String(d.fields.beforeCaption ?? "").trim();
      const city = String(d.fields.city ?? "").trim();
      const project: PublishedProject = {
        id: slug || d.id,
        title,
        category,
        image,
        caption: caption || title,
        isFeatured: Boolean(d.fields.isFeatured),
      };
      if (beforeImage) project.beforeImage = beforeImage;
      if (beforeCaption) project.beforeCaption = beforeCaption;
      if (city) project.city = city;
      return project;
    })
    .filter((p) => p.title.length > 0 && p.image.length > 0);

  if (fromCms.length > 0) return fromCms;

  return siteProjects.map((p) => {
    const project: PublishedProject = {
      id: p.id,
      title: p.title,
      category: p.category,
      image: p.image,
      caption: p.caption,
    };
    if ("beforeImage" in p && typeof p.beforeImage === "string") {
      project.beforeImage = p.beforeImage;
    }
    if ("beforeCaption" in p && typeof p.beforeCaption === "string") {
      project.beforeCaption = p.beforeCaption;
    }
    return project;
  });
}

export function projectsSourceIsCms(): boolean {
  return listContent("projects").some((d) => d.status === "published");
}

/**
 * Live fence types for /services, residential/commercial, home cards.
 * Published CMS → else site.ts. Optional audience filter (both always matches).
 * Chatbot still imports site.ts fencingServices.
 */
export function getPublishedFenceTypes(
  audience?: "residential" | "commercial",
): PublishedFenceType[] {
  const docs = listContent("fence-types").filter(
    (d) => d.status === "published",
  );
  const fromCms = docs
    .map((d) => {
      const slug = String(d.fields.slug ?? d.id).trim();
      const title = String(d.fields.name ?? "").trim();
      const tagline = String(d.fields.tagline ?? "").trim();
      const summary = String(d.fields.summary ?? "").trim();
      const details = String(d.fields.details ?? "").trim();
      const image = String(d.fields.image ?? "").trim();
      const aud = parseAudience(String(d.fields.audience ?? "both").trim());
      return {
        slug,
        title,
        tagline,
        summary,
        details,
        image,
        audience: aud,
      } satisfies PublishedFenceType;
    })
    .filter((f) => f.slug.length > 0 && f.title.length > 0 && f.image.length > 0);

  const all =
    fromCms.length > 0
      ? fromCms
      : siteFenceTypes.map((s) => ({
          slug: s.slug,
          title: s.title,
          tagline: s.tagline,
          summary: s.summary,
          details: s.details,
          image: s.image,
          audience: "both" as const,
        }));

  return all.filter((f) => matchesAudience(f.audience, audience));
}

export function fenceTypesSourceIsCms(): boolean {
  return listContent("fence-types").some((d) => d.status === "published");
}

/**
 * Live deck/services offerings for /services, residential/commercial.
 * Published CMS → else site.ts. Optional audience filter.
 * Chatbot still imports site.ts deckServices.
 */
export function getPublishedServices(
  audience?: "residential" | "commercial",
): PublishedService[] {
  const docs = listContent("services").filter((d) => d.status === "published");
  const fromCms = docs
    .map((d) => {
      const slug = String(d.fields.slug ?? d.id).trim();
      const title = String(d.fields.name ?? "").trim();
      const summary = String(d.fields.summary ?? "").trim();
      const details = String(d.fields.details ?? "").trim();
      const aud = parseAudience(String(d.fields.audience ?? "both").trim());
      return {
        slug,
        title,
        summary,
        details,
        audience: aud,
      } satisfies PublishedService;
    })
    .filter((s) => s.slug.length > 0 && s.title.length > 0);

  const all =
    fromCms.length > 0
      ? fromCms
      : siteDeckServices.map((s) => ({
          slug: s.slug,
          title: s.title,
          summary: s.summary,
          details: s.details,
          audience: "residential" as const,
        }));

  return all.filter((s) => matchesAudience(s.audience, audience));
}

export function servicesSourceIsCms(): boolean {
  return listContent("services").some((d) => d.status === "published");
}
