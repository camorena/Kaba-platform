/**
 * Public CMS readers — safe partial cutover helpers.
 *
 * Prefer site.ts fallback when CMS has no published docs.
 * Only wire marketing pages that have been explicitly cut over.
 */

import "server-only";

import { listContent } from "@/lib/cms/memory-store";
import type {
  PublishedFaq,
  PublishedProject,
  PublishedTestimonial,
} from "@/lib/cms/types";
import {
  faqs as siteFaqs,
  galleryProjects as siteProjects,
  testimonials as siteTestimonials,
} from "@/lib/site";

export type { PublishedFaq, PublishedProject, PublishedTestimonial };

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
