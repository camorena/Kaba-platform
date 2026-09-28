/**
 * Public CMS readers — safe partial cutover helpers.
 *
 * Prefer site.ts fallback when CMS has no published docs.
 * Only wire marketing pages that have been explicitly cut over.
 */

import "server-only";

import { listContent } from "@/lib/cms/memory-store";
import { faqs as siteFaqs } from "@/lib/site";

export type PublishedFaq = {
  question: string;
  answer: string;
};

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

/** True when /faq is reading CMS published rows (seeded = true after warm store). */
export function faqsSourceIsCms(): boolean {
  return listContent("faqs").some((d) => d.status === "published");
}
