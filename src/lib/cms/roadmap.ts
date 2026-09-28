/**
 * Public-site CMS roadmap — which admin pages own marketing content,
 * and how they replace `src/lib/site.ts` over time.
 *
 * v8 ships Phase A + B admin stubs + Phase C media scaffold.
 * FAQ (/faq) optionally reads CMS via getPublishedFaqs(); all other
 * public pages still use site.ts until each cutover.
 *
 * See preview/REUSE_PORT_v8.md and preview/CMS_PUBLIC_CONTENT_PLAN.md.
 */

export type CmsPhase = "A" | "B" | "C" | "D";

export type PlannedContentType = {
  key: string;
  phase: CmsPhase;
  /** Admin nav / hub label (EN). */
  plural: string;
  pluralEs: string;
  /** site.ts exports (or pages) this type will replace. */
  siteSources: string[];
  /** Public routes affected. */
  publicPaths: string[];
  /** Shipped in current codebase (list/edit stubs). */
  shipped: boolean;
  /** Public marketing page reads CMS when published (partial cutover). */
  publicCutover?: boolean;
  notes: string;
};

/**
 * Full inventory of PUBLIC content the owner should eventually edit in admin.
 * Phase A–C = shipped scaffold. D = planned (hub may show as “upcoming”).
 */
export const CMS_PUBLIC_ROADMAP: readonly PlannedContentType[] = [
  {
    key: "fence-types",
    phase: "A",
    plural: "Fence types",
    pluralEs: "Tipos de cerca",
    siteSources: ["fencingServices", "fencingOptionsNav"],
    publicPaths: ["/services", "/"],
    shipped: true,
    notes: "Product cards + hash anchors. Accent/audience later.",
  },
  {
    key: "services",
    phase: "A",
    plural: "Services",
    pluralEs: "Servicios",
    siteSources: ["deckServices", "yourNeeds (partial)"],
    publicPaths: ["/services", "/residential", "/commercial"],
    shipped: true,
    notes: "Deck + service offerings. Keep fencing in fence-types.",
  },
  {
    key: "projects",
    phase: "A",
    plural: "Projects / gallery",
    pluralEs: "Proyectos / galería",
    siteSources: ["galleryProjects"],
    publicPaths: ["/gallery", "/"],
    shipped: true,
    notes: "Before/after + captions. Media refs in Phase C.",
  },
  {
    key: "faqs",
    phase: "A",
    plural: "FAQs",
    pluralEs: "Preguntas frecuentes",
    siteSources: ["faqs"],
    publicPaths: ["/faq"],
    shipped: true,
    publicCutover: true,
    notes: "v8: /faq + FAQ JSON-LD read getPublishedFaqs(). Chatbot still site.ts.",
  },
  {
    key: "site-copy",
    phase: "B",
    plural: "Site copy & CTAs",
    pluralEs: "Textos y CTAs del sitio",
    siteSources: [
      "siteConfig (tagline, hero*, description)",
      "howItWorks",
      "processTimeline",
      "kabaExperience",
      "trustPoints",
    ],
    publicPaths: ["/", "header/footer", "/how-it-works"],
    shipped: true,
    notes: "Keyed copy bag. Prefer keys over free-form HTML. Not cut over yet.",
  },
  {
    key: "about",
    phase: "B",
    plural: "About page",
    pluralEs: "Página Nosotros",
    siteSources: ["aboutLocalTrust", "aboutStats", "companyValues"],
    publicPaths: ["/about"],
    shipped: true,
    notes: "Story blocks + stats. Claims stay gated via trust-claims. Not cut over.",
  },
  {
    key: "testimonials",
    phase: "B",
    plural: "Reviews / testimonials",
    pluralEs: "Reseñas / testimonios",
    siteSources: ["testimonials"],
    publicPaths: ["/reviews", "/"],
    shipped: true,
    notes: "Quote, name, town. No fake star counts. Not cut over.",
  },
  {
    key: "service-area",
    phase: "B",
    plural: "Service area towns",
    pluralEs: "Ciudades de servicio",
    siteSources: ["serviceTowns", "siteConfig.serviceArea"],
    publicPaths: ["/service-area", "JSON-LD areaServed"],
    shipped: true,
    notes: "Town list is a claim — keep honest. Not cut over.",
  },
  {
    key: "materials",
    phase: "B",
    plural: "Materials guide",
    pluralEs: "Guía de materiales",
    siteSources: ["fenceMaterials", "materialGuidance", "deckMaterials"],
    publicPaths: ["/materials"],
    shipped: true,
    notes: "Guidance copy only — no dollar prices. Not cut over.",
  },
  {
    key: "media",
    phase: "C",
    plural: "Media library",
    pluralEs: "Biblioteca de medios",
    siteSources: ["public/gallery/* paths referenced by projects & services"],
    publicPaths: ["all image consumers"],
    shipped: true,
    notes:
      "Path + alt + provenance scaffold. Drop files in public/gallery/ — no paid storage. Binary upload/EXIF later.",
  },
  {
    key: "i18n-public",
    phase: "D",
    plural: "Public bilingual copy",
    pluralEs: "Copia pública bilingüe",
    siteSources: ["(new) locale fields on each document"],
    publicPaths: ["optional /es marketing"],
    shipped: false,
    notes: "Admin is already EN+es-CO. Public ES only if product asks.",
  },
] as const;

export function shippedContentKeys(): string[] {
  return CMS_PUBLIC_ROADMAP.filter((t) => t.shipped).map((t) => t.key);
}

export function upcomingContentTypes(): PlannedContentType[] {
  return CMS_PUBLIC_ROADMAP.filter((t) => !t.shipped);
}

export function cutoverContentTypes(): PlannedContentType[] {
  return CMS_PUBLIC_ROADMAP.filter((t) => t.publicCutover);
}
