/** CMS content document — flat string/number/boolean fields from the registry. */

export type ContentFieldValue = string | number | boolean | null;

export type ContentDocument = {
  id: string;
  type: string;
  /** Draft | published — scaffold only; public site still uses site.ts. */
  status: "draft" | "published";
  sortOrder: number;
  updatedAt: string;
  fields: Record<string, ContentFieldValue>;
};
