import "server-only";

import { getRepos } from "@/lib/db/adapter";
import type { ReviewRecord } from "@/lib/reviews/model";
import {
  resolvePublicHighlights,
  type PublicHighlightStat,
} from "@/lib/stats/highlights";

/**
 * Public data access for reviews + highlight stats. Never throws: a DB
 * problem renders the honest empty state instead of a 500.
 */

export type PublicReview = Pick<
  ReviewRecord,
  "id" | "customerName" | "city" | "rating" | "body" | "source" | "reviewDate" | "featured"
>;

function toPublic(r: ReviewRecord): PublicReview {
  return {
    id: r.id,
    customerName: r.customerName,
    city: r.city,
    rating: r.rating,
    body: r.body,
    source: r.source,
    reviewDate: r.reviewDate,
    featured: r.featured,
  };
}

export async function getPublishedReviews(): Promise<PublicReview[]> {
  try {
    return (await getRepos().reviews.listPublished()).map(toPublic);
  } catch (err) {
    console.error("[reviews] public load failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

export async function getFeaturedReviews(limit = 3): Promise<PublicReview[]> {
  return (await getPublishedReviews()).filter((r) => r.featured).slice(0, limit);
}

export async function getPublicHighlightStats(): Promise<PublicHighlightStat[]> {
  try {
    const repos = getRepos();
    const stats = await repos.highlightStats.list();
    const needsCount = stats.some((s) => s.visible && s.autoSource === "customers_count");
    const customersCount = needsCount ? (await repos.customers.list()).length : 0;
    return resolvePublicHighlights(stats, { customersCount });
  } catch (err) {
    console.error("[highlights] public load failed:", err instanceof Error ? err.message : err);
    return [];
  }
}
