/**
 * Customer reviews — shared types + validation (API, repos, UI).
 * Only real reviews entered by staff; public only when published.
 */

export const REVIEW_SOURCES = [
  "google",
  "nextdoor",
  "facebook",
  "direct",
  "other",
] as const;
export type ReviewSource = (typeof REVIEW_SOURCES)[number];

export type ReviewRecord = {
  id: string;
  customerName: string;
  city: string;
  rating: number;
  body: string;
  source: ReviewSource;
  sourceUrl: string | null;
  /** YYYY-MM-DD */
  reviewDate: string;
  customerId: string | null;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ReviewInput = Omit<ReviewRecord, "id" | "createdAt" | "updatedAt">;
export type ReviewPatch = Partial<ReviewInput>;

export const REVIEW_LIMITS = {
  name: 80,
  city: 80,
  body: 2000,
  url: 500,
} as const;

export type ReviewFieldError =
  | "customerName"
  | "city"
  | "rating"
  | "body"
  | "source"
  | "sourceUrl"
  | "reviewDate"
  | "customerId"
  | "published"
  | "featured";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isReviewSource(v: unknown): v is ReviewSource {
  return typeof v === "string" && (REVIEW_SOURCES as readonly string[]).includes(v);
}

function isValidYmd(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(+d) && d.toISOString().slice(0, 10) === s;
}

function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export type ReviewValidation<T> =
  | { ok: true; value: T }
  | { ok: false; field: ReviewFieldError };

/**
 * Validate a create (full) or update (partial) payload.
 * `allowNonUuidCustomer` lets the memory adapter accept non-UUID customer ids.
 */
export function validateReview(
  raw: unknown,
  opts: { partial: boolean; now?: Date; allowNonUuidCustomer?: boolean },
): ReviewValidation<ReviewPatch> {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: ReviewPatch = {};
  const has = (k: string) => Object.prototype.hasOwnProperty.call(r, k);
  const need = (k: string) => !opts.partial || has(k);

  if (need("customerName")) {
    const v = typeof r.customerName === "string" ? r.customerName.trim().replace(/\s+/g, " ") : "";
    if (!v || v.length > REVIEW_LIMITS.name) return { ok: false, field: "customerName" };
    out.customerName = v;
  }
  if (need("city")) {
    const v = r.city == null ? "" : typeof r.city === "string" ? r.city.trim() : null;
    if (v === null || v.length > REVIEW_LIMITS.city) return { ok: false, field: "city" };
    out.city = v;
  }
  if (need("rating")) {
    const v = Number(r.rating);
    if (!Number.isInteger(v) || v < 1 || v > 5) return { ok: false, field: "rating" };
    out.rating = v;
  }
  if (need("body")) {
    const v = typeof r.body === "string" ? r.body.trim() : "";
    if (!v || v.length > REVIEW_LIMITS.body) return { ok: false, field: "body" };
    out.body = v;
  }
  if (need("source")) {
    const v = r.source ?? (opts.partial ? undefined : "direct");
    if (!isReviewSource(v)) return { ok: false, field: "source" };
    out.source = v;
  }
  if (has("sourceUrl") || !opts.partial) {
    const v = r.sourceUrl == null ? "" : typeof r.sourceUrl === "string" ? r.sourceUrl.trim() : null;
    if (v === null || v.length > REVIEW_LIMITS.url || (v && !isHttpUrl(v))) {
      return { ok: false, field: "sourceUrl" };
    }
    out.sourceUrl = v || null;
  }
  if (need("reviewDate")) {
    const v = typeof r.reviewDate === "string" ? r.reviewDate.trim() : "";
    if (!isValidYmd(v)) return { ok: false, field: "reviewDate" };
    // Allow one day of slack for time zones; never future-dated reviews.
    const limit = new Date((opts.now ?? new Date()).getTime() + 86_400_000)
      .toISOString()
      .slice(0, 10);
    if (v > limit || v < "1990-01-01") return { ok: false, field: "reviewDate" };
    out.reviewDate = v;
  }
  if (has("customerId") || !opts.partial) {
    const v = r.customerId == null || r.customerId === "" ? null : r.customerId;
    if (v !== null) {
      if (typeof v !== "string") return { ok: false, field: "customerId" };
      if (!opts.allowNonUuidCustomer && !UUID_RE.test(v)) {
        return { ok: false, field: "customerId" };
      }
    }
    out.customerId = v as string | null;
  }
  for (const k of ["published", "featured"] as const) {
    if (has(k)) {
      if (typeof r[k] !== "boolean") return { ok: false, field: k };
      out[k] = r[k] as boolean;
    } else if (!opts.partial) {
      out[k] = false;
    }
  }
  return { ok: true, value: out };
}

/** Public-facing display: "Maria G." stays as entered; never derived. */
export function averageRating(reviews: ReadonlyArray<Pick<ReviewRecord, "rating">>): number | null {
  if (!reviews.length) return null;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}
