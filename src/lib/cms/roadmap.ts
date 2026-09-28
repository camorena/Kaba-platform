/**
 * Public-site CMS roadmap — which admin pages own marketing content,
 * and how they replace `src/lib/site.ts` over time.
 *
 * Phase A–C admin shipped. Public cutovers: faqs, testimonials, projects,
 * fence-types, services, about, materials (+ FAQs), service-area (+ JSON-LD),
 * site-copy (hero/trust/experience/needs/process/nav/footer/fencingNav/legal/contact/brand/address/social),
 * remaining contact CTAs, and chatbot catalogs via getPublished*
 * (CMS published → site.ts fallback).
 *
 * See preview/REUSE_PORT_v15.md and preview/CMS_PUBLIC_CONTENT_PLAN.md.
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
    siteSources: ["fencingServices"],
    publicPaths: ["/services", "/residential", "/commercial", "/", "chatbot"],
    shipped: true,
    publicCutover: true,
    notes: "v10: /services + residential/commercial + home cards. v12: chatbot fencing lists. Dropdown labels → site-copy fencingNav (v14).",
  },
  {
    key: "services",
    phase: "A",
    plural: "Services",
    pluralEs: "Servicios",
    siteSources: ["deckServices"],
    publicPaths: ["/services", "/residential", "/commercial", "chatbot"],
    shipped: true,
    publicCutover: true,
    notes: "v10: /services + residential/commercial (deck). v12: chatbot deck lists.",
  },
  {
    key: "projects",
    phase: "A",
    plural: "Projects / gallery",
    pluralEs: "Proyectos / galería",
    siteSources: ["galleryProjects"],
    publicPaths: ["/gallery", "/"],
    shipped: true,
    publicCutover: true,
    notes: "v9: /gallery + home work teaser read getPublishedProjects().",
  },
  {
    key: "faqs",
    phase: "A",
    plural: "FAQs",
    pluralEs: "Preguntas frecuentes",
    siteSources: ["faqs"],
    publicPaths: ["/faq", "chatbot"],
    shipped: true,
    publicCutover: true,
    notes: "v8+: /faq + FAQ JSON-LD. v12: chatbot FAQ matching also uses getPublishedFaqs().",
  },
  {
    key: "site-copy",
    phase: "B",
    plural: "Site copy & CTAs",
    pluralEs: "Textos y CTAs del sitio",
    siteSources: [
      "siteConfig (name, tagline, hero*, description, phone/email/hours, address, social)",
      "howItWorks",
      "processTimeline",
      "kabaExperience",
      "trustPoints",
      "yourNeeds",
      "navLinks",
      "footerLinks",
      "fencingOptionsNav",
      "legalLinks",
    ],
    publicPaths: [
      "/",
      "/how-it-works",
      "/residential",
      "nav",
      "footer",
      "fencingNav",
      "legal",
      "contact",
      "brand",
      "address",
      "social",
      "metadata",
      "CTAs",
      "pay",
      "invoice-letterhead",
      "chatbot",
      "header",
      "body-copy",
      "QuoteForm",
      "notify",
    ],
    shipped: true,
    publicCutover: true,
    notes: "v12–v15 as prior. v16: remaining brand holdouts — header logo, per-page metadata/body copy, chatbot/ChatWidget/QuoteForm labels, notify subjects; address city/state in chatbot. howItWorks.* unused on public.",
  },
  {
    key: "about",
    phase: "B",
    plural: "About page",
    pluralEs: "Página Nosotros",
    siteSources: ["aboutLocalTrust", "aboutStats", "companyValues"],
    publicPaths: ["/about"],
    shipped: true,
    publicCutover: true,
    notes: "v11: /about reads getPublishedAbout*. Trust-claims Settings stay separate from About CMS (home trust bar is site-copy).",
  },
  {
    key: "testimonials",
    phase: "B",
    plural: "Reviews / testimonials",
    pluralEs: "Reseñas / testimonios",
    siteSources: ["testimonials"],
    publicPaths: ["/reviews", "/"],
    shipped: true,
    publicCutover: true,
    notes: "v9: /reviews + home teaser read getPublishedTestimonials(). No fake star ratings.",
  },
  {
    key: "service-area",
    phase: "B",
    plural: "Service area towns",
    pluralEs: "Ciudades de servicio",
    siteSources: ["serviceTowns", "siteConfig.serviceArea"],
    publicPaths: ["/service-area", "/about", "JSON-LD"],
    shipped: true,
    publicCutover: true,
    notes: "v11: /service-area + about coverage teaser. v13: JSON-LD areaServed from published towns. Keep towns honest.",
  },
  {
    key: "materials",
    phase: "B",
    plural: "Materials guide",
    pluralEs: "Guía de materiales",
    siteSources: ["fenceMaterials", "materialGuidance", "deckMaterials", "materialFaqs"],
    publicPaths: ["/materials"],
    shipped: true,
    publicCutover: true,
    notes: "v11: fence/deck/guidance. v13: materials FAQ accordion (kind=faq). No dollar prices.",
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
