/** CMS content document — flat string/number/boolean fields from the registry. */

export type ContentFieldValue = string | number | boolean | null;

export type ContentDocument = {
  id: string;
  type: string;
  /**
   * Draft | published.
   * Publishing affects the live site only for types with a public cutover
   * (faqs, testimonials, projects via getPublished*). Other types stay
   * admin-only until their swap — marketing still uses site.ts.
   */
  status: "draft" | "published";
  sortOrder: number;
  updatedAt: string;
  fields: Record<string, ContentFieldValue>;
};

export type PublishedFaq = {
  question: string;
  answer: string;
};

export type PublishedTestimonial = {
  quote: string;
  name: string;
  town: string;
};

export type PublishedProject = {
  id: string;
  title: string;
  category: "fence" | "deck";
  image: string;
  caption: string;
  beforeImage?: string;
  beforeCaption?: string;
  city?: string;
  isFeatured?: boolean;
};
