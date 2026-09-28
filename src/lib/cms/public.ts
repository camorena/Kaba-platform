/**
 * Public CMS readers — safe partial cutover helpers.
 *
 * Prefer site.ts fallback when CMS has no published docs.
 * Only wire marketing pages that have been explicitly cut over.
 */

import "server-only";

import { listContent } from "@/lib/cms/memory-store";
import type {
  PublishedAboutLocalTrust,
  PublishedAboutStat,
  PublishedAudience,
  PublishedCompanyValue,
  PublishedDeckMaterial,
  PublishedExperienceStep,
  PublishedFaq,
  PublishedFenceMaterial,
  PublishedFenceType,
  PublishedHeroCopy,
  PublishedMaterialComparison,
  PublishedMaterialGuidance,
  PublishedNeed,
  PublishedProcessStep,
  PublishedProject,
  PublishedService,
  PublishedServiceTown,
  PublishedTestimonial,
  PublishedTrustPoint,
} from "@/lib/cms/types";
import {
  aboutLocalTrust as siteAboutLocalTrust,
  aboutStats as siteAboutStats,
  companyValues as siteCompanyValues,
  deckMaterials as siteDeckMaterials,
  deckServices as siteDeckServices,
  faqs as siteFaqs,
  fenceMaterials as siteFenceMaterials,
  fencingServices as siteFenceTypes,
  galleryProjects as siteProjects,
  kabaExperience as siteKabaExperience,
  materialGuidance as siteMaterialGuidance,
  processTimeline as siteProcessTimeline,
  serviceTowns as siteServiceTowns,
  siteConfig as siteSiteConfig,
  testimonials as siteTestimonials,
  trustPoints as siteTrustPoints,
  yourNeeds as siteYourNeeds,
} from "@/lib/site";

export type {
  PublishedAboutLocalTrust,
  PublishedAboutStat,
  PublishedAudience,
  PublishedCompanyValue,
  PublishedDeckMaterial,
  PublishedExperienceStep,
  PublishedFaq,
  PublishedFenceMaterial,
  PublishedFenceType,
  PublishedHeroCopy,
  PublishedMaterialComparison,
  PublishedMaterialGuidance,
  PublishedNeed,
  PublishedProcessStep,
  PublishedProject,
  PublishedService,
  PublishedServiceTown,
  PublishedTestimonial,
  PublishedTrustPoint,
};

function parseAudience(raw: string): PublishedAudience {
  if (raw === "residential" || raw === "commercial") return raw;
  return "both";
}

function matchesAudience(
  audience: PublishedAudience,
  filter?: "residential" | "commercial",
): boolean {
  if (!filter) return true;
  return audience === "both" || audience === filter;
}

/**
 * Live FAQ reader for /faq (+ JSON-LD).
 * Uses published CMS faqs when present; otherwise site.ts.
 * Also feeds chatbot FAQ matching via marketing layout catalog.
 */
export function getPublishedFaqs(): PublishedFaq[] {
  const docs = listContent("faqs").filter((d) => d.status === "published");
  const fromCms = docs
    .map((d) => ({
      question: String(d.fields.question ?? "").trim(),
      answer: String(d.fields.answer ?? "").trim(),
    }))
    .filter((f) => f.question.length > 0 && f.answer.length > 0);

  if (fromCms.length > 0) return fromCms;

  return siteFaqs.map((f) => ({ question: f.question, answer: f.answer }));
}

/** True when /faq is reading CMS published rows. */
export function faqsSourceIsCms(): boolean {
  return listContent("faqs").some((d) => d.status === "published");
}

/**
 * Live testimonials for /reviews + home teaser.
 * Published CMS → else site.ts. No star ratings (claims honesty).
 */
export function getPublishedTestimonials(): PublishedTestimonial[] {
  const docs = listContent("testimonials").filter(
    (d) => d.status === "published",
  );
  const fromCms = docs
    .map((d) => ({
      quote: String(d.fields.quote ?? "").trim(),
      name: String(d.fields.name ?? "").trim(),
      town: String(d.fields.town ?? "").trim(),
    }))
    .filter((t) => t.quote.length > 0 && t.name.length > 0 && t.town.length > 0);

  if (fromCms.length > 0) return fromCms;

  return siteTestimonials.map((t) => ({
    quote: t.quote,
    name: t.name,
    town: t.town,
  }));
}

export function testimonialsSourceIsCms(): boolean {
  return listContent("testimonials").some((d) => d.status === "published");
}

/**
 * Live gallery/projects for /gallery (+ home work teaser).
 * Published CMS → else site.ts. beforeImage optional for before/after.
 */
export function getPublishedProjects(): PublishedProject[] {
  const docs = listContent("projects").filter((d) => d.status === "published");
  const fromCms = docs
    .map((d) => {
      const categoryRaw = String(d.fields.category ?? "fence").trim();
      const category: "fence" | "deck" =
        categoryRaw === "deck" ? "deck" : "fence";
      const slug = String(d.fields.slug ?? d.id).trim();
      const image = String(d.fields.image ?? "").trim();
      const title = String(d.fields.title ?? "").trim();
      const caption = String(d.fields.caption ?? "").trim();
      const beforeImage = String(d.fields.beforeImage ?? "").trim();
      const beforeCaption = String(d.fields.beforeCaption ?? "").trim();
      const city = String(d.fields.city ?? "").trim();
      const project: PublishedProject = {
        id: slug || d.id,
        title,
        category,
        image,
        caption: caption || title,
        isFeatured: Boolean(d.fields.isFeatured),
      };
      if (beforeImage) project.beforeImage = beforeImage;
      if (beforeCaption) project.beforeCaption = beforeCaption;
      if (city) project.city = city;
      return project;
    })
    .filter((p) => p.title.length > 0 && p.image.length > 0);

  if (fromCms.length > 0) return fromCms;

  return siteProjects.map((p) => {
    const project: PublishedProject = {
      id: p.id,
      title: p.title,
      category: p.category,
      image: p.image,
      caption: p.caption,
    };
    if ("beforeImage" in p && typeof p.beforeImage === "string") {
      project.beforeImage = p.beforeImage;
    }
    if ("beforeCaption" in p && typeof p.beforeCaption === "string") {
      project.beforeCaption = p.beforeCaption;
    }
    return project;
  });
}

export function projectsSourceIsCms(): boolean {
  return listContent("projects").some((d) => d.status === "published");
}

/**
 * Live fence types for /services, residential/commercial, home cards.
 * Published CMS → else site.ts. Optional audience filter (both always matches).
 * Also feeds chatbot fencing name/detail lists via layout catalog.
 */
export function getPublishedFenceTypes(
  audience?: "residential" | "commercial",
): PublishedFenceType[] {
  const docs = listContent("fence-types").filter(
    (d) => d.status === "published",
  );
  const fromCms = docs
    .map((d) => {
      const slug = String(d.fields.slug ?? d.id).trim();
      const title = String(d.fields.name ?? "").trim();
      const tagline = String(d.fields.tagline ?? "").trim();
      const summary = String(d.fields.summary ?? "").trim();
      const details = String(d.fields.details ?? "").trim();
      const image = String(d.fields.image ?? "").trim();
      const aud = parseAudience(String(d.fields.audience ?? "both").trim());
      return {
        slug,
        title,
        tagline,
        summary,
        details,
        image,
        audience: aud,
      } satisfies PublishedFenceType;
    })
    .filter((f) => f.slug.length > 0 && f.title.length > 0 && f.image.length > 0);

  const all =
    fromCms.length > 0
      ? fromCms
      : siteFenceTypes.map((s) => ({
          slug: s.slug,
          title: s.title,
          tagline: s.tagline,
          summary: s.summary,
          details: s.details,
          image: s.image,
          audience: "both" as const,
        }));

  return all.filter((f) => matchesAudience(f.audience, audience));
}

export function fenceTypesSourceIsCms(): boolean {
  return listContent("fence-types").some((d) => d.status === "published");
}

/**
 * Live deck/services offerings for /services, residential/commercial.
 * Published CMS → else site.ts. Optional audience filter.
 * Also feeds chatbot deck name/detail lists via layout catalog.
 */
export function getPublishedServices(
  audience?: "residential" | "commercial",
): PublishedService[] {
  const docs = listContent("services").filter((d) => d.status === "published");
  const fromCms = docs
    .map((d) => {
      const slug = String(d.fields.slug ?? d.id).trim();
      const title = String(d.fields.name ?? "").trim();
      const summary = String(d.fields.summary ?? "").trim();
      const details = String(d.fields.details ?? "").trim();
      const aud = parseAudience(String(d.fields.audience ?? "both").trim());
      return {
        slug,
        title,
        summary,
        details,
        audience: aud,
      } satisfies PublishedService;
    })
    .filter((s) => s.slug.length > 0 && s.title.length > 0);

  const all =
    fromCms.length > 0
      ? fromCms
      : siteDeckServices.map((s) => ({
          slug: s.slug,
          title: s.title,
          summary: s.summary,
          details: s.details,
          audience: "residential" as const,
        }));

  return all.filter((s) => matchesAudience(s.audience, audience));
}

export function servicesSourceIsCms(): boolean {
  return listContent("services").some((d) => d.status === "published");
}

function splitLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function abbreviateLifespan(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  // "15–25 years with care" → "15–25 yrs" when possible
  const m = trimmed.match(/^([\d]+\s*[–-]\s*[\d]+\+?)\s*years?/i);
  if (m) return `${m[1].replace(/\s+/g, "")} yrs`;
  return trimmed;
}

/**
 * About local-trust cards for /about.
 * Published CMS kind=local-trust → else site.ts. Trust-claims settings stay separate.
 */
export function getPublishedAboutLocalTrust(): PublishedAboutLocalTrust[] {
  const docs = listContent("about").filter(
    (d) => d.status === "published" && String(d.fields.kind ?? "") === "local-trust",
  );
  const fromCms = docs
    .map((d) => ({
      title: String(d.fields.title ?? "").trim(),
      description: String(d.fields.description ?? "").trim(),
    }))
    .filter((i) => i.title.length > 0 && i.description.length > 0);

  if (fromCms.length > 0) return fromCms;

  return siteAboutLocalTrust.map((i) => ({
    title: i.title,
    description: i.description,
  }));
}

/**
 * About hero stats for /about.
 * CMS kind=stats: title=value, description=label.
 */
export function getPublishedAboutStats(): PublishedAboutStat[] {
  const docs = listContent("about").filter(
    (d) => d.status === "published" && String(d.fields.kind ?? "") === "stats",
  );
  const fromCms = docs
    .map((d) => ({
      value: String(d.fields.title ?? "").trim(),
      label: String(d.fields.description ?? "").trim(),
    }))
    .filter((s) => s.value.length > 0 && s.label.length > 0);

  if (fromCms.length > 0) return fromCms;

  return siteAboutStats.map((s) => ({ value: s.value, label: s.label }));
}

/**
 * Company values for /about.
 * Published CMS kind=values → else site.ts.
 */
export function getPublishedCompanyValues(): PublishedCompanyValue[] {
  const docs = listContent("about").filter(
    (d) => d.status === "published" && String(d.fields.kind ?? "") === "values",
  );
  const fromCms = docs
    .map((d) => ({
      title: String(d.fields.title ?? "").trim(),
      description: String(d.fields.description ?? "").trim(),
    }))
    .filter((v) => v.title.length > 0 && v.description.length > 0);

  if (fromCms.length > 0) return fromCms;

  return siteCompanyValues.map((v) => ({
    title: v.title,
    description: v.description,
  }));
}

export function aboutSourceIsCms(): boolean {
  return listContent("about").some((d) => d.status === "published");
}

/**
 * Service towns for /service-area (+ about coverage teaser).
 * Geographic claim — keep honest. JSON-LD areaServed stays hardcoded in jsonld.ts.
 */
export function getPublishedServiceTowns(): PublishedServiceTown[] {
  const docs = listContent("service-area").filter(
    (d) => d.status === "published",
  );
  const fromCms = docs
    .map((d) => ({
      name: String(d.fields.name ?? "").trim(),
      region: String(d.fields.region ?? "").trim(),
      note: String(d.fields.note ?? "").trim(),
    }))
    .filter((t) => t.name.length > 0);

  if (fromCms.length > 0) return fromCms;

  return siteServiceTowns.map((t) => ({
    name: t.name,
    region: t.region,
    note: t.note,
  }));
}

export function serviceAreaSourceIsCms(): boolean {
  return listContent("service-area").some((d) => d.status === "published");
}

/**
 * Fence materials for /materials.
 * Guidance only — costTier uses $ symbols, never dollar amounts.
 */
export function getPublishedFenceMaterials(): PublishedFenceMaterial[] {
  const docs = listContent("materials").filter(
    (d) => d.status === "published" && String(d.fields.kind ?? "") === "fence",
  );
  const fromCms = docs
    .map((d) => {
      const id = String(d.fields.slug ?? d.id).trim();
      const name = String(d.fields.name ?? "").trim();
      const image = String(d.fields.image ?? "").trim();
      return {
        id,
        name,
        tagline: String(d.fields.tagline ?? "").trim(),
        bestFor: String(d.fields.bestFor ?? "").trim(),
        lifespan: String(d.fields.lifespan ?? "").trim(),
        maintenance: String(d.fields.maintenance ?? "").trim(),
        privacy: String(d.fields.privacy ?? "").trim(),
        upkeep: String(d.fields.upkeep ?? "").trim(),
        costTier: String(d.fields.costTier ?? "").trim(),
        servicesHref: String(d.fields.servicesHref ?? "").trim() || "/services",
        image,
        pros: splitLines(String(d.fields.pros ?? "")),
        cons: splitLines(String(d.fields.cons ?? "")),
        tip: String(d.fields.tip ?? "").trim(),
      } satisfies PublishedFenceMaterial;
    })
    .filter((m) => m.id.length > 0 && m.name.length > 0 && m.image.length > 0);

  if (fromCms.length > 0) return fromCms;

  return siteFenceMaterials.map((m) => ({
    id: m.id,
    name: m.name,
    tagline: m.tagline,
    bestFor: m.bestFor,
    lifespan: m.lifespan,
    maintenance: m.maintenance,
    privacy: m.privacy,
    upkeep: m.upkeep,
    costTier: m.costTier,
    servicesHref: m.servicesHref,
    image: m.image,
    pros: [...m.pros],
    cons: [...m.cons],
    tip: m.tip,
  }));
}

export function getPublishedDeckMaterials(): PublishedDeckMaterial[] {
  const docs = listContent("materials").filter(
    (d) => d.status === "published" && String(d.fields.kind ?? "") === "deck",
  );
  const fromCms = docs
    .map((d) => {
      const id = String(d.fields.slug ?? d.id).trim();
      const name = String(d.fields.name ?? "").trim();
      return {
        id,
        name,
        bestFor: String(d.fields.bestFor ?? "").trim(),
        lifespan: String(d.fields.lifespan ?? "").trim(),
        maintenance: String(d.fields.maintenance ?? "").trim(),
        pros: splitLines(String(d.fields.pros ?? "")),
        cons: splitLines(String(d.fields.cons ?? "")),
        tip: String(d.fields.tip ?? "").trim(),
      } satisfies PublishedDeckMaterial;
    })
    .filter((m) => m.id.length > 0 && m.name.length > 0);

  if (fromCms.length > 0) return fromCms;

  return siteDeckMaterials.map((m) => ({
    id: m.id,
    name: m.name,
    bestFor: m.bestFor,
    lifespan: m.lifespan,
    maintenance: m.maintenance,
    pros: [...m.pros],
    cons: [...m.cons],
    tip: m.tip,
  }));
}

export function getPublishedMaterialGuidance(): PublishedMaterialGuidance[] {
  const docs = listContent("materials").filter(
    (d) =>
      d.status === "published" && String(d.fields.kind ?? "") === "guidance",
  );
  const fromCms = docs
    .map((d) => ({
      title: String(d.fields.name ?? "").trim(),
      body: String(d.fields.tip ?? "").trim(),
    }))
    .filter((g) => g.title.length > 0 && g.body.length > 0);

  if (fromCms.length > 0) return fromCms;

  return siteMaterialGuidance.map((g) => ({ title: g.title, body: g.body }));
}

/** Comparison table rows derived from published fence materials. */
export function getPublishedMaterialComparison(): PublishedMaterialComparison[] {
  return getPublishedFenceMaterials().map((m) => ({
    id: m.id,
    name: m.name,
    privacy: m.privacy,
    maintenance: m.upkeep || m.maintenance,
    lifespan: abbreviateLifespan(m.lifespan) || m.lifespan,
    bestWhen: m.bestFor,
  }));
}

export function materialsSourceIsCms(): boolean {
  return listContent("materials").some((d) => d.status === "published");
}

/**
 * Process timeline for /how-it-works from site-copy process.* keys.
 * Low-risk guidance copy. Requires a full published set; else site.ts.
 * howItWorks.* keys remain unused on public pages.
 */
export function getPublishedProcessTimeline(): PublishedProcessStep[] {
  const docs = listContent("site-copy").filter(
    (d) =>
      d.status === "published" &&
      String(d.fields.group ?? "") === "process",
  );
  const byKey = new Map<string, string>();
  for (const d of docs) {
    const key = String(d.fields.key ?? "").trim();
    const value = String(d.fields.value ?? "").trim();
    if (key && value) byKey.set(key, value);
  }

  const steps = ["01", "02", "03", "04"] as const;
  const fromCms: PublishedProcessStep[] = [];
  for (const step of steps) {
    const title = byKey.get(`process.${step}.title`) ?? "";
    const eyebrow = byKey.get(`process.${step}.eyebrow`) ?? "";
    const description = byKey.get(`process.${step}.description`) ?? "";
    if (!title || !description) {
      fromCms.length = 0;
      break;
    }
    fromCms.push({ step, title, eyebrow, description });
  }

  if (fromCms.length === steps.length) return fromCms;

  return siteProcessTimeline.map((s) => ({
    step: s.step,
    title: s.title,
    eyebrow: s.eyebrow,
    description: s.description,
  }));
}

export function processTimelineSourceIsCms(): boolean {
  const docs = listContent("site-copy").filter(
    (d) =>
      d.status === "published" &&
      String(d.fields.group ?? "") === "process",
  );
  const keys = new Set(
    docs.map((d) => String(d.fields.key ?? "").trim()).filter(Boolean),
  );
  return ["01", "02", "03", "04"].every(
    (step) =>
      keys.has(`process.${step}.title`) &&
      keys.has(`process.${step}.description`),
  );
}

function siteCopyValueMap(group?: string): Map<string, string> {
  const docs = listContent("site-copy").filter((d) => d.status === "published");
  const byKey = new Map<string, string>();
  for (const d of docs) {
    if (group && String(d.fields.group ?? "") !== group) continue;
    const key = String(d.fields.key ?? "").trim();
    const value = String(d.fields.value ?? "").trim();
    if (key && value) byKey.set(key, value);
  }
  return byKey;
}

/**
 * Hero / tagline / description for home (+ metadata).
 * Per-key: published site-copy value when present, else site.ts.
 */
export function getPublishedHeroCopy(): PublishedHeroCopy {
  const byKey = siteCopyValueMap("hero");
  return {
    tagline: byKey.get("site.tagline") ?? siteSiteConfig.tagline,
    description: byKey.get("site.description") ?? siteSiteConfig.description,
    heroLabel: byKey.get("hero.label") ?? siteSiteConfig.heroLabel,
    heroHeadline: byKey.get("hero.headline") ?? siteSiteConfig.heroHeadline,
    heroSub: byKey.get("hero.sub") ?? siteSiteConfig.heroSub,
  };
}

export function heroCopySourceIsCms(): boolean {
  const keys = ["site.tagline", "site.description", "hero.label", "hero.headline", "hero.sub"];
  const published = siteCopyValueMap("hero");
  return keys.some((k) => published.has(k));
}

/**
 * Trust bar labels for home. Full published trust.1..N set → else site.ts.
 * Icons stay aligned with site.ts order (CMS stores labels only).
 * Trust-claims Settings remain a separate store.
 */
export function getPublishedTrustPoints(): PublishedTrustPoint[] {
  const byKey = siteCopyValueMap("trust");
  const siteIcons = siteTrustPoints.map((t) => t.icon);
  const fromCms: PublishedTrustPoint[] = [];
  for (let i = 0; i < siteTrustPoints.length; i++) {
    const value = byKey.get(`trust.${i + 1}`) ?? "";
    if (!value) {
      fromCms.length = 0;
      break;
    }
    fromCms.push({
      label: value,
      icon: siteIcons[i] ?? "home",
    });
  }
  if (fromCms.length === siteTrustPoints.length) return fromCms;
  return siteTrustPoints.map((t) => ({ label: t.label, icon: t.icon }));
}

export function trustPointsSourceIsCms(): boolean {
  const byKey = siteCopyValueMap("trust");
  return siteTrustPoints.every((_, i) => byKey.has(`trust.${i + 1}`));
}

const NEED_ICONS = new Set(["paw", "home", "wrench"]);

/**
 * Your-needs cards for home + residential.
 * Requires a full published set (title+description per site id); else site.ts.
 */
export function getPublishedYourNeeds(): PublishedNeed[] {
  const byKey = siteCopyValueMap("needs");
  const fromCms: PublishedNeed[] = [];
  for (const need of siteYourNeeds) {
    const title = byKey.get(`need.${need.id}.title`) ?? "";
    const description = byKey.get(`need.${need.id}.description`) ?? "";
    if (!title || !description) {
      fromCms.length = 0;
      break;
    }
    const image = byKey.get(`need.${need.id}.image`) ?? need.image;
    const iconRaw = byKey.get(`need.${need.id}.icon`) ?? need.icon;
    const icon = NEED_ICONS.has(iconRaw)
      ? (iconRaw as PublishedNeed["icon"])
      : need.icon;
    fromCms.push({ id: need.id, title, description, image, icon });
  }
  if (fromCms.length === siteYourNeeds.length) return fromCms;
  return siteYourNeeds.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    image: n.image,
    icon: n.icon,
  }));
}

export function yourNeedsSourceIsCms(): boolean {
  const byKey = siteCopyValueMap("needs");
  return siteYourNeeds.every(
    (n) =>
      byKey.has(`need.${n.id}.title`) && byKey.has(`need.${n.id}.description`),
  );
}

const EXP_ICONS = new Set(["listen", "guide", "build", "care"]);

/**
 * Kaba experience steps for home (safe home site-copy keys).
 * Full published experience.* set → else site.ts. Icons from site by id.
 */
export function getPublishedKabaExperience(): PublishedExperienceStep[] {
  const byKey = siteCopyValueMap("experience");
  const fromCms: PublishedExperienceStep[] = [];
  for (const step of siteKabaExperience) {
    const title = byKey.get(`experience.${step.id}.title`) ?? "";
    const description = byKey.get(`experience.${step.id}.description`) ?? "";
    if (!title || !description) {
      fromCms.length = 0;
      break;
    }
    fromCms.push({
      id: step.id,
      title,
      description,
      icon: EXP_ICONS.has(step.icon) ? step.icon : "listen",
    });
  }
  if (fromCms.length === siteKabaExperience.length) return fromCms;
  return siteKabaExperience.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    icon: s.icon,
  }));
}

export function kabaExperienceSourceIsCms(): boolean {
  const byKey = siteCopyValueMap("experience");
  return siteKabaExperience.every(
    (s) =>
      byKey.has(`experience.${s.id}.title`) &&
      byKey.has(`experience.${s.id}.description`),
  );
}

/** True when any home-facing site-copy group (hero/trust/needs/experience/process) is live. */
export function siteCopyHomeSourceIsCms(): boolean {
  return (
    heroCopySourceIsCms() ||
    trustPointsSourceIsCms() ||
    yourNeedsSourceIsCms() ||
    kabaExperienceSourceIsCms() ||
    processTimelineSourceIsCms()
  );
}

