/**
 * In-memory reviews + highlight stats. Intentionally NO seed data:
 * reviews are only ever real entries typed by staff.
 */

import type { HighlightStatsRepo, ReviewsRepo } from "@/lib/db/repos/types";
import type { ReviewRecord } from "@/lib/reviews/model";
import type { HighlightStatRecord } from "@/lib/stats/highlights";

declare global {
  var __kabaReviews: ReviewRecord[] | undefined;
  var __kabaHighlightStats: HighlightStatRecord[] | undefined;
}

function reviews(): ReviewRecord[] {
  globalThis.__kabaReviews ??= [];
  return globalThis.__kabaReviews;
}

function highlights(): HighlightStatRecord[] {
  globalThis.__kabaHighlightStats ??= [];
  return globalThis.__kabaHighlightStats;
}

function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function byNewest(a: ReviewRecord, b: ReviewRecord): number {
  return b.reviewDate.localeCompare(a.reviewDate) || b.createdAt.localeCompare(a.createdAt);
}

export const memoryReviewsRepo: ReviewsRepo = {
  async list() {
    return [...reviews()].sort(byNewest);
  },
  async listPublished() {
    return reviews().filter((r) => r.published).sort(byNewest);
  },
  async get(id) {
    return reviews().find((r) => r.id === id);
  },
  async create(input) {
    const now = new Date().toISOString();
    const rec: ReviewRecord = { ...input, id: newId("rev"), createdAt: now, updatedAt: now };
    reviews().push(rec);
    return rec;
  },
  async update(id, patch) {
    const rec = reviews().find((r) => r.id === id);
    if (!rec) return undefined;
    Object.assign(rec, patch, { updatedAt: new Date().toISOString() });
    return rec;
  },
  async remove(id) {
    const list = reviews();
    const i = list.findIndex((r) => r.id === id);
    if (i < 0) return false;
    list.splice(i, 1);
    return true;
  },
};

export const memoryHighlightStatsRepo: HighlightStatsRepo = {
  async list() {
    return [...highlights()].sort(
      (a, b) => a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt),
    );
  },
  async create(input) {
    const now = new Date().toISOString();
    const rec: HighlightStatRecord = { ...input, id: newId("hs"), createdAt: now, updatedAt: now };
    highlights().push(rec);
    return rec;
  },
  async update(id, patch) {
    const rec = highlights().find((r) => r.id === id);
    if (!rec) return undefined;
    Object.assign(rec, patch, { updatedAt: new Date().toISOString() });
    return rec;
  },
  async remove(id) {
    const list = highlights();
    const i = list.findIndex((r) => r.id === id);
    if (i < 0) return false;
    list.splice(i, 1);
    return true;
  },
};
