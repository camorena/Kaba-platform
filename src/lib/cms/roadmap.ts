/**
 * Public-site CMS roadmap — which admin pages will own marketing content,
 * and how they replace `src/lib/site.ts` over time.
 *
 * v7 ships Phase A stubs only (fence-types / services / projects / faqs).
 * Later phases add types below; do not rip site.ts until each type’s cutover.
 *
 * See preview/REUSE_PORT_v7.md and preview/CMS_PUBLIC_CONTENT_PLAN.md.
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
  notes: string;
};

/**
 * Full inventory of PUBLIC content the owner should eventually edit in admin.
 * Phase A = shipped scaffold. B–D = planned (hub may show as “upcoming”).
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
    notes: "Before/after + captions. Media upload in Phase C.",
  },
  {
    key: "faqs",
    phase: "A",
    plural: "FAQs",
    pluralEs: "Preguntas frecuentes",
    siteSources: ["faqs"],
    publicPaths: ["/faq", "chatbot answers"],
    shipped: true,
    notes: "No prices in answers. Chatbot should read same source after swap.",
  },
  {
    key: "site-copy",
    phase: "B",
    plural: "Site copy & CTAs",
    pluralEs: "Textos y CTAs del sitio",
    siteSources: [
      "siteConfig (tagline, hero*, description)",
      "navLinks / footerLinks labels",
      "howItWorks",
      "processTimeline",
      "kabaExperience",
      "trustPoints",
    ],
    publicPaths: ["/", "header/footer", "/how-it-works"],
    shipped: false,
    notes: "Keyed copy bag (hero, CTAs). Prefer keys over free-form HTML.",
  },
  {
    key: "about",
    phase: "B",
    plural: "About page",
    pluralEs: "Página Nosotros",
    siteSources: ["aboutLocalTrust", "aboutStats", "companyValues"],
    publicPaths: ["/about"],
    shipped: false,
    notes: "Story blocks + stats. Claims stay gated via trust-claims.",
  },
  {
    key: "testimonials",
    phase: "B",
    plural: "Reviews / testimonials",
    pluralEs: "Reseñas / testimonios",
    siteSources: ["testimonials"],
    publicPaths: ["/reviews", "/"],
    shipped: false,
    notes: "Quote, name, town. No fake star counts without proof.",
  },
  {
    key: "service-area",
    phase: "B",
    plural: "Service area towns",
    pluralEs: "Ciudades de servicio",
    siteSources: ["serviceTowns", "siteConfig.serviceArea"],
    publicPaths: ["/service-area", "JSON-LD areaServed"],
    shipped: false,
    notes: "Town list is a claim — keep honest vs service footprint.",
  },
  {
    key: "materials",
    phase: "B",
    plural: "Materials guide",
    pluralEs: "Guía de materiales",
    siteSources: ["fenceMaterials", "materialComparison", "materialGuidance", "deckMaterials"],
    publicPaths: ["/materials"],
    shipped: false,
    notes: "Guidance copy only — no dollar prices in CMS cards.",
  },
  {
    key: "media",
    phase: "C",
    plural: "Media library",
    pluralEs: "Biblioteca de medios",
    siteSources: ["public/gallery/* paths referenced by projects & services"],
    publicPaths: ["all image consumers"],
    shipped: false,
    notes: "Upload + alt required + EXIF strip. Provenance (kaba vs stock).",
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
