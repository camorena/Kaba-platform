/** CMS content document — flat string/number/boolean fields from the registry. */

export type ContentFieldValue = string | number | boolean | null;

export type ContentDocument = {
  id: string;
  type: string;
  /**
   * Draft | published.
   * Publishing affects the live site only for types with a public cutover
   * (currently FAQs via getPublishedFaqs). All other types stay admin-only
   * until their swap — marketing still uses site.ts.
   */
  status: "draft" | "published";
  sortOrder: number;
  updatedAt: string;
  fields: Record<string, ContentFieldValue>;
};
