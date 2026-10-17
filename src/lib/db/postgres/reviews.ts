/**
 * Postgres reviews + highlight stats (db/migrations/0012_reviews_highlights.sql).
 */

import { isUuid } from "@/lib/db/ids";
import { query } from "@/lib/db/postgres/connection";
import type { HighlightStatsRepo, ReviewsRepo } from "@/lib/db/repos/types";
import type { ReviewPatch, ReviewRecord, ReviewSource } from "@/lib/reviews/model";
import type {
  HighlightAutoSource,
  HighlightStatPatch,
  HighlightStatRecord,
} from "@/lib/stats/highlights";

type ReviewRow = {
  id: string;
  customer_name: string;
  city: string;
  rating: number;
  body: string;
  source: string;
  source_url: string | null;
  review_date: string | Date;
  customer_id: string | null;
  published: boolean;
  featured: boolean;
  created_at: Date | string;
  updated_at: Date | string;
};

type HighlightRow = {
  id: string;
  label: string;
  value: string;
  visible: boolean;
  auto_source: string | null;
  sort_order: number;
  created_at: Date | string;
  updated_at: Date | string;
};

const iso = (v: Date | string) => new Date(v).toISOString();
const ymd = (v: Date | string) =>
  v instanceof Date
    ? `${v.getFullYear()}-${String(v.getMonth() + 1).padStart(2, "0")}-${String(v.getDate()).padStart(2, "0")}`
    : String(v).slice(0, 10);

function mapReview(r: ReviewRow): ReviewRecord {
  return {
    id: r.id,
    customerName: r.customer_name,
    city: r.city,
    rating: Number(r.rating),
    body: r.body,
    source: r.source as ReviewSource,
    sourceUrl: r.source_url,
    reviewDate: ymd(r.review_date),
    customerId: r.customer_id,
    published: r.published,
    featured: r.featured,
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

function mapHighlight(r: HighlightRow): HighlightStatRecord {
  return {
    id: r.id,
    label: r.label,
    value: r.value,
    visible: r.visible,
    autoSource: (r.auto_source as HighlightAutoSource | null) ?? null,
    sortOrder: Number(r.sort_order),
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

const REVIEW_COLUMNS: Record<keyof ReviewPatch, string> = {
  customerName: "customer_name",
  city: "city",
  rating: "rating",
  body: "body",
  source: "source",
  sourceUrl: "source_url",
  reviewDate: "review_date",
  customerId: "customer_id",
  published: "published",
  featured: "featured",
};

const HIGHLIGHT_COLUMNS: Record<keyof HighlightStatPatch, string> = {
  label: "label",
  value: "value",
  visible: "visible",
  autoSource: "auto_source",
  sortOrder: "sort_order",
};

/** Build "col = $n" pairs from a whitelisted patch. */
function setClause<P extends object>(
  patch: P,
  columns: Record<keyof P, string>,
  startAt: number,
): { sql: string; values: unknown[] } {
  const parts: string[] = [];
  const values: unknown[] = [];
  for (const key of Object.keys(columns) as (keyof P)[]) {
    if (!(key in patch) || patch[key] === undefined) continue;
    values.push(patch[key]);
    parts.push(`${columns[key]} = $${startAt + values.length - 1}`);
  }
  return { sql: parts.join(", "), values };
}

const REVIEW_ORDER = "order by review_date desc, created_at desc";

export function createPostgresReviewsRepo(): ReviewsRepo {
  return {
    async list() {
      const { rows } = await query<ReviewRow>(`select * from reviews ${REVIEW_ORDER}`);
      return rows.map(mapReview);
    },
    async listPublished() {
      const { rows } = await query<ReviewRow>(
        `select * from reviews where published ${REVIEW_ORDER}`,
      );
      return rows.map(mapReview);
    },
    async get(id) {
      if (!isUuid(id)) return undefined;
      const { rows } = await query<ReviewRow>(`select * from reviews where id = $1`, [id]);
      return rows[0] ? mapReview(rows[0]) : undefined;
    },
    async create(i) {
      const { rows } = await query<ReviewRow>(
        `insert into reviews (customer_name, city, rating, body, source, source_url,
           review_date, customer_id, published, featured)
         values ($1,$2,$3,$4,$5,$6,$7::date,$8,$9,$10)
         returning *`,
        [
          i.customerName,
          i.city,
          i.rating,
          i.body,
          i.source,
          i.sourceUrl,
          i.reviewDate,
          i.customerId,
          i.published,
          i.featured,
        ],
      );
      return mapReview(rows[0]);
    },
    async update(id, patch) {
      if (!isUuid(id)) return undefined;
      const set = setClause(patch, REVIEW_COLUMNS, 2);
      const { rows } = await query<ReviewRow>(
        `update reviews set ${set.sql ? `${set.sql}, ` : ""}updated_at = now()
         where id = $1 returning *`,
        [id, ...set.values],
      );
      return rows[0] ? mapReview(rows[0]) : undefined;
    },
    async remove(id) {
      if (!isUuid(id)) return false;
      const res = await query(`delete from reviews where id = $1`, [id]);
      return (res.rowCount ?? 0) > 0;
    },
  };
}

export function createPostgresHighlightStatsRepo(): HighlightStatsRepo {
  return {
    async list() {
      const { rows } = await query<HighlightRow>(
        `select * from highlight_stats order by sort_order asc, created_at asc`,
      );
      return rows.map(mapHighlight);
    },
    async create(i) {
      const { rows } = await query<HighlightRow>(
        `insert into highlight_stats (label, value, visible, auto_source, sort_order)
         values ($1,$2,$3,$4,$5) returning *`,
        [i.label, i.value, i.visible, i.autoSource, i.sortOrder],
      );
      return mapHighlight(rows[0]);
    },
    async update(id, patch) {
      if (!isUuid(id)) return undefined;
      const set = setClause(patch, HIGHLIGHT_COLUMNS, 2);
      const { rows } = await query<HighlightRow>(
        `update highlight_stats set ${set.sql ? `${set.sql}, ` : ""}updated_at = now()
         where id = $1 returning *`,
        [id, ...set.values],
      );
      return rows[0] ? mapHighlight(rows[0]) : undefined;
    },
    async remove(id) {
      if (!isUuid(id)) return false;
      const res = await query(`delete from highlight_stats where id = $1`, [id]);
      return (res.rowCount ?? 0) > 0;
    },
  };
}
