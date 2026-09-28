/** CMS content document — flat string/number/boolean fields from the registry. */

export type ContentFieldValue = string | number | boolean | null;

export type ContentDocument = {
  id: string;
  type: string;
  /**
   * Draft | published.
   * Publishing affects the live site only for types with a public cutover
   * (faqs, testimonials, projects, fence-types, services, about, materials,
   * service-area, and process.* site-copy via getPublished*).
   * Other types stay admin-only until their swap — marketing still uses site.ts.
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

export type PublishedAudience = "both" | "residential" | "commercial";

export type PublishedFenceType = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  details: string;
  image: string;
  audience: PublishedAudience;
};

export type PublishedService = {
  slug: string;
  title: string;
  summary: string;
  details: string;
  audience: PublishedAudience;
};

export type PublishedAboutLocalTrust = {
  title: string;
  description: string;
};

export type PublishedAboutStat = {
  value: string;
  label: string;
};

export type PublishedCompanyValue = {
  title: string;
  description: string;
};

export type PublishedServiceTown = {
  name: string;
  region: string;
  note: string;
};

export type PublishedFenceMaterial = {
  id: string;
  name: string;
  tagline: string;
  bestFor: string;
  lifespan: string;
  maintenance: string;
  privacy: string;
  upkeep: string;
  costTier: string;
  servicesHref: string;
  image: string;
  pros: string[];
  cons: string[];
  tip: string;
};

export type PublishedDeckMaterial = {
  id: string;
  name: string;
  bestFor: string;
  lifespan: string;
  maintenance: string;
  pros: string[];
  cons: string[];
  tip: string;
};

export type PublishedMaterialGuidance = {
  title: string;
  body: string;
};

export type PublishedMaterialComparison = {
  id: string;
  name: string;
  privacy: string;
  maintenance: string;
  lifespan: string;
  bestWhen: string;
};

export type PublishedProcessStep = {
  step: string;
  title: string;
  eyebrow: string;
  description: string;
};

