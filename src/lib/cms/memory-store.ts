/**
 * Memory CMS store — seeded from site.ts mirrors.
 * Edits persist in-process only (reset on cold start). SQL migration optional.
 */

import "server-only";

import { resolveContentType } from "@/lib/cms/content-types";
import type { ContentDocument, ContentFieldValue } from "@/lib/cms/types";
import {
  aboutLocalTrust,
  aboutStats,
  companyValues,
  deckMaterials,
  deckServices,
  faqs,
  fencingOptionsNav,
  fencingServices,
  fenceMaterials,
  footerLinks,
  legalLinks,
  galleryProjects,
  howItWorks,
  kabaExperience,
  materialFaqs,
  materialGuidance,
  navLinks,
  processTimeline,
  serviceTowns,
  siteConfig,
  testimonials,
  trustPoints,
  yourNeeds,
} from "@/lib/site";

let store: Map<string, ContentDocument[]> | null = null;

function nowIso(): string {
  return new Date().toISOString();
}

function joinLines(items: readonly string[]): string {
  return items.join("\n");
}

function seed(): Map<string, ContentDocument[]> {
  const map = new Map<string, ContentDocument[]>();

  map.set(
    "fence-types",
    fencingServices.map((s, i) => ({
      id: `ft_${s.slug}`,
      type: "fence-types",
      status: "published" as const,
      sortOrder: i + 1,
      updatedAt: nowIso(),
      fields: {
        name: s.title,
        slug: s.slug,
        tagline: s.tagline,
        summary: s.summary,
        details: s.details,
        image: s.image,
        audience: "both",
        sortOrder: i + 1,
      },
    })),
  );

  map.set(
    "services",
    deckServices.map((s, i) => ({
      id: `svc_${s.slug}`,
      type: "services",
      status: "published" as const,
      sortOrder: i + 1,
      updatedAt: nowIso(),
      fields: {
        name: s.title,
        slug: s.slug,
        summary: s.summary,
        details: s.details,
        audience: "residential",
        sortOrder: i + 1,
      },
    })),
  );

  map.set(
    "projects",
    galleryProjects.map((p, i) => {
      const seed = p as {
        id: string;
        title: string;
        category: "fence" | "deck";
        caption: string;
        image: string;
        beforeImage?: string;
        beforeCaption?: string;
      };
      return {
        id: `proj_${seed.id}`,
        type: "projects",
        status: "published" as const,
        sortOrder: i + 1,
        updatedAt: nowIso(),
        fields: {
          title: seed.title,
          slug: seed.id,
          category: seed.category,
          caption: seed.caption,
          image: seed.image,
          beforeImage: seed.beforeImage ?? "",
          beforeCaption: seed.beforeCaption ?? "",
          city: "",
          isFeatured: i < 3,
          sortOrder: i + 1,
        },
      };
    }),
  );

  map.set(
    "faqs",
    faqs.map((f, i) => ({
      id: `faq_${i + 1}`,
      type: "faqs",
      status: "published" as const,
      sortOrder: i + 1,
      updatedAt: nowIso(),
      fields: {
        question: f.question,
        answer: f.answer,
        category: "general",
        sortOrder: i + 1,
      },
    })),
  );

  const siteCopyRows: {
    key: string;
    group: string;
    label: string;
    value: string;
  }[] = [
    { key: "site.name", group: "hero", label: "Brand name", value: siteConfig.name },
    { key: "site.tagline", group: "hero", label: "Tagline", value: siteConfig.tagline },
    {
      key: "site.description",
      group: "hero",
      label: "Description",
      value: siteConfig.description,
    },
    {
      key: "site.serviceArea",
      group: "hero",
      label: "Service area blurb",
      value: siteConfig.serviceArea,
    },
    { key: "hero.label", group: "hero", label: "Hero label", value: siteConfig.heroLabel },
    {
      key: "hero.headline",
      group: "hero",
      label: "Hero headline",
      value: siteConfig.heroHeadline,
    },
    { key: "hero.sub", group: "hero", label: "Hero sub", value: siteConfig.heroSub },
    ...howItWorks.map((step) => ({
      key: `howItWorks.${step.step}.title`,
      group: "how-it-works",
      label: `How it works ${step.step} title`,
      value: step.title,
    })),
    ...howItWorks.map((step) => ({
      key: `howItWorks.${step.step}.description`,
      group: "how-it-works",
      label: `How it works ${step.step} description`,
      value: step.description,
    })),
    ...processTimeline.flatMap((step) => [
      {
        key: `process.${step.step}.title`,
        group: "process",
        label: `Process ${step.step} title`,
        value: step.title,
      },
      {
        key: `process.${step.step}.eyebrow`,
        group: "process",
        label: `Process ${step.step} eyebrow`,
        value: step.eyebrow,
      },
      {
        key: `process.${step.step}.description`,
        group: "process",
        label: `Process ${step.step} description`,
        value: step.description,
      },
    ]),
    ...kabaExperience.flatMap((item) => [
      {
        key: `experience.${item.id}.title`,
        group: "experience",
        label: `Experience ${item.id} title`,
        value: item.title,
      },
      {
        key: `experience.${item.id}.description`,
        group: "experience",
        label: `Experience ${item.id} description`,
        value: item.description,
      },
    ]),
    ...trustPoints.map((tp, i) => ({
      key: `trust.${i + 1}`,
      group: "trust",
      label: `Trust point ${i + 1}`,
      value: tp.label,
    })),
    ...yourNeeds.flatMap((need) => [
      {
        key: `need.${need.id}.title`,
        group: "needs",
        label: `Need ${need.id} title`,
        value: need.title,
      },
      {
        key: `need.${need.id}.description`,
        group: "needs",
        label: `Need ${need.id} description`,
        value: need.description,
      },
      {
        key: `need.${need.id}.image`,
        group: "needs",
        label: `Need ${need.id} image`,
        value: need.image,
      },
      {
        key: `need.${need.id}.icon`,
        group: "needs",
        label: `Need ${need.id} icon`,
        value: need.icon,
      },
    ]),
    ...navLinks.map((link) => {
      const slug = link.href.replace(/^\//, "").replace(/\//g, "-") || "home";
      return {
        key: `nav.${slug}.label`,
        group: "nav",
        label: `Nav ${slug}`,
        value: link.label,
      };
    }),
    ...footerLinks.map((link) => {
      const slug = link.href.replace(/^\//, "").replace(/\//g, "-") || "home";
      return {
        key: `footer.${slug}.label`,
        group: "nav",
        label: `Footer ${slug}`,
        value: link.label,
      };
    }),
    ...fencingOptionsNav.map((link) => ({
      key: `fencingNav.${link.slug}.label`,
      group: "nav",
      label: `Fencing nav ${link.slug}`,
      value: link.label,
    })),
    ...legalLinks.map((link) => {
      const slug = link.href.replace(/^\//, "").replace(/\//g, "-") || "home";
      return {
        key: `legal.${slug}.label`,
        group: "nav",
        label: `Legal ${slug}`,
        value: link.label,
      };
    }),
    {
      key: "contact.phone",
      group: "contact",
      label: "Phone",
      value: siteConfig.phone,
    },
    {
      key: "contact.phoneHref",
      group: "contact",
      label: "Phone href",
      value: siteConfig.phoneHref,
    },
    {
      key: "contact.email",
      group: "contact",
      label: "Email",
      value: siteConfig.email,
    },
    {
      key: "contact.emailHref",
      group: "contact",
      label: "Email href",
      value: siteConfig.emailHref,
    },
    {
      key: "contact.hours.weekdays",
      group: "contact",
      label: "Hours weekdays",
      value: siteConfig.hours.weekdays,
    },
    {
      key: "contact.hours.saturday",
      group: "contact",
      label: "Hours Saturday",
      value: siteConfig.hours.saturday,
    },
    {
      key: "contact.hours.sunday",
      group: "contact",
      label: "Hours Sunday",
      value: siteConfig.hours.sunday,
    },
    {
      key: "contact.serviceArea",
      group: "contact",
      label: "Service area blurb",
      value: siteConfig.serviceArea,
    },
    {
      key: "contact.address.city",
      group: "contact",
      label: "Address city",
      value: siteConfig.address.city,
    },
    {
      key: "contact.address.state",
      group: "contact",
      label: "Address state",
      value: siteConfig.address.state,
    },
    {
      key: "contact.address.zip",
      group: "contact",
      label: "Address ZIP",
      value: siteConfig.address.zip,
    },
    {
      key: "contact.address.region",
      group: "contact",
      label: "Address region",
      value: siteConfig.address.region,
    },
    {
      key: "contact.social.facebook",
      group: "contact",
      label: "Facebook URL",
      value: siteConfig.social.facebook,
    },
    {
      key: "contact.social.instagram",
      group: "contact",
      label: "Instagram URL",
      value: siteConfig.social.instagram,
    },
    {
      key: "contact.social.linkedin",
      group: "contact",
      label: "LinkedIn URL",
      value: siteConfig.social.linkedin,
    },
  ];

  map.set(
    "site-copy",
    siteCopyRows.map((row, i) => ({
      id: `copy_${row.key.replace(/\./g, "_")}`,
      type: "site-copy",
      status: "published" as const,
      sortOrder: i + 1,
      updatedAt: nowIso(),
      fields: {
        key: row.key,
        group: row.group,
        label: row.label,
        value: row.value,
        sortOrder: i + 1,
      },
    })),
  );

  const aboutDocs: ContentDocument[] = [
    ...aboutLocalTrust.map((item, i) => ({
      id: `about_trust_${i + 1}`,
      type: "about",
      status: "published" as const,
      sortOrder: i + 1,
      updatedAt: nowIso(),
      fields: {
        kind: "local-trust",
        title: item.title,
        description: item.description,
        sortOrder: i + 1,
      },
    })),
    ...aboutStats.map((item, i) => ({
      id: `about_stat_${i + 1}`,
      type: "about",
      status: "published" as const,
      sortOrder: 100 + i + 1,
      updatedAt: nowIso(),
      fields: {
        kind: "stats",
        title: item.value,
        description: item.label,
        sortOrder: 100 + i + 1,
      },
    })),
    ...companyValues.map((item, i) => ({
      id: `about_value_${i + 1}`,
      type: "about",
      status: "published" as const,
      sortOrder: 200 + i + 1,
      updatedAt: nowIso(),
      fields: {
        kind: "values",
        title: item.title,
        description: item.description,
        sortOrder: 200 + i + 1,
      },
    })),
  ];
  map.set("about", aboutDocs);

  map.set(
    "testimonials",
    testimonials.map((t, i) => ({
      id: `testimonial_${i + 1}`,
      type: "testimonials",
      status: "published" as const,
      sortOrder: i + 1,
      updatedAt: nowIso(),
      fields: {
        quote: t.quote,
        name: t.name,
        town: t.town,
        sortOrder: i + 1,
      },
    })),
  );

  map.set(
    "service-area",
    serviceTowns.map((town, i) => ({
      id: `town_${town.name.toLowerCase().replace(/\s+/g, "-")}`,
      type: "service-area",
      status: "published" as const,
      sortOrder: i + 1,
      updatedAt: nowIso(),
      fields: {
        name: town.name,
        region: town.region,
        note: town.note,
        sortOrder: i + 1,
      },
    })),
  );

  const materialDocs: ContentDocument[] = [
    ...fenceMaterials.map((m, i) => ({
      id: `mat_fence_${m.id}`,
      type: "materials",
      status: "published" as const,
      sortOrder: i + 1,
      updatedAt: nowIso(),
      fields: {
        kind: "fence",
        name: m.name,
        slug: m.id,
        tagline: m.tagline,
        bestFor: m.bestFor,
        lifespan: m.lifespan,
        maintenance: m.maintenance,
        privacy: m.privacy,
        upkeep: m.upkeep,
        costTier: m.costTier,
        image: m.image,
        servicesHref: m.servicesHref,
        pros: joinLines(m.pros),
        cons: joinLines(m.cons),
        tip: m.tip,
        sortOrder: i + 1,
      },
    })),
    ...deckMaterials.map((m, i) => ({
      id: `mat_deck_${m.id}`,
      type: "materials",
      status: "published" as const,
      sortOrder: 100 + i + 1,
      updatedAt: nowIso(),
      fields: {
        kind: "deck",
        name: m.name,
        slug: m.id,
        tagline: "",
        bestFor: m.bestFor,
        lifespan: m.lifespan,
        maintenance: m.maintenance,
        privacy: "",
        upkeep: "",
        costTier: "",
        image: "",
        servicesHref: "",
        pros: joinLines(m.pros),
        cons: joinLines(m.cons),
        tip: m.tip,
        sortOrder: 100 + i + 1,
      },
    })),
    ...materialGuidance.map((g, i) => ({
      id: `mat_guide_${i + 1}`,
      type: "materials",
      status: "published" as const,
      sortOrder: 200 + i + 1,
      updatedAt: nowIso(),
      fields: {
        kind: "guidance",
        name: g.title,
        slug: `guidance-${i + 1}`,
        tagline: "",
        bestFor: "",
        lifespan: "",
        maintenance: "",
        privacy: "",
        upkeep: "",
        costTier: "",
        image: "",
        servicesHref: "",
        pros: "",
        cons: "",
        tip: g.body,
        sortOrder: 200 + i + 1,
      },
    })),
    ...materialFaqs.map((f, i) => ({
      id: `mat_faq_${i + 1}`,
      type: "materials",
      status: "published" as const,
      sortOrder: 300 + i + 1,
      updatedAt: nowIso(),
      fields: {
        kind: "faq",
        name: f.question,
        slug: `mat-faq-${i + 1}`,
        tagline: "",
        bestFor: "",
        lifespan: "",
        maintenance: "",
        privacy: "",
        upkeep: "",
        costTier: "",
        image: "",
        servicesHref: "",
        pros: "",
        cons: "",
        tip: f.answer,
        sortOrder: 300 + i + 1,
      },
    })),
  ];
  map.set("materials", materialDocs);

  type GallerySeed = {
    id: string;
    title: string;
    caption: string;
    image: string;
    beforeImage?: string;
    beforeCaption?: string;
  };
  const gallerySeed = galleryProjects as readonly GallerySeed[];
  const seenPaths = new Set<string>();
  const mediaDocs: ContentDocument[] = [];
  let mediaOrder = 0;
  for (const project of gallerySeed) {
    const image = project.image;
    const caption = project.caption || project.title;
    if (!seenPaths.has(image)) {
      seenPaths.add(image);
      mediaOrder += 1;
      mediaDocs.push({
        id: `media_${project.id}`,
        type: "media",
        status: "published",
        sortOrder: mediaOrder,
        updatedAt: nowIso(),
        fields: {
          path: image,
          alt: caption,
          provenance: "kaba",
          width: null,
          height: null,
          notes: "Seeded from galleryProjects. Place binaries under public/gallery/.",
          sortOrder: mediaOrder,
        },
      });
    }
    const beforeImage =
      "beforeImage" in project && typeof project.beforeImage === "string"
        ? project.beforeImage
        : null;
    const beforeCaption =
      "beforeCaption" in project && typeof project.beforeCaption === "string"
        ? project.beforeCaption
        : `Before — ${project.title}`;
    if (beforeImage && !seenPaths.has(beforeImage)) {
      seenPaths.add(beforeImage);
      mediaOrder += 1;
      mediaDocs.push({
        id: `media_before_${project.id}`,
        type: "media",
        status: "published",
        sortOrder: mediaOrder,
        updatedAt: nowIso(),
        fields: {
          path: beforeImage,
          alt: beforeCaption,
          provenance: "kaba",
          width: null,
          height: null,
          notes: "Before image. Place binaries under public/gallery/before/.",
          sortOrder: mediaOrder,
        },
      });
    }
  }
  map.set("media", mediaDocs);

  return map;
}

function ensure(): Map<string, ContentDocument[]> {
  if (!store) store = seed();
  return store;
}

function sortDocs(type: string, docs: ContentDocument[]): ContentDocument[] {
  const spec = resolveContentType(type);
  const key = spec?.orderBy ?? "sortOrder";
  return [...docs].sort((a, b) => {
    const av = (a.fields[key] ?? a.sortOrder) as number;
    const bv = (b.fields[key] ?? b.sortOrder) as number;
    return Number(av) - Number(bv);
  });
}

export function listContent(type: string): ContentDocument[] {
  if (!resolveContentType(type)) return [];
  const docs = ensure().get(type) ?? [];
  return sortDocs(type, docs);
}

export function getContent(type: string, id: string): ContentDocument | null {
  if (!resolveContentType(type)) return null;
  const docs = ensure().get(type) ?? [];
  return docs.find((d) => d.id === id) ?? null;
}

export function updateContent(
  type: string,
  id: string,
  patch: {
    status?: "draft" | "published";
    fields?: Record<string, ContentFieldValue>;
  },
): ContentDocument | null {
  const spec = resolveContentType(type);
  if (!spec) return null;
  const docs = ensure().get(type) ?? [];
  const idx = docs.findIndex((d) => d.id === id);
  if (idx < 0) return null;

  const current = docs[idx];
  const nextFields = { ...current.fields };
  if (patch.fields) {
    for (const field of spec.fields) {
      if (!(field.name in patch.fields)) continue;
      if (field.locked) continue;
      let value = patch.fields[field.name];
      if (field.kind === "number" && value !== null && value !== undefined && value !== "") {
        value = Number(value);
        if (!Number.isFinite(value)) value = current.fields[field.name] ?? 0;
      }
      if (field.kind === "checkbox") {
        value = Boolean(value);
      }
      if (typeof value === "string" && field.maxLength) {
        value = value.slice(0, field.maxLength);
      }
      nextFields[field.name] = value as ContentFieldValue;
    }
  }

  const sortOrder =
    typeof nextFields.sortOrder === "number"
      ? nextFields.sortOrder
      : current.sortOrder;

  const updated: ContentDocument = {
    ...current,
    status: patch.status ?? current.status,
    sortOrder,
    updatedAt: nowIso(),
    fields: nextFields,
  };
  docs[idx] = updated;
  ensure().set(type, docs);
  return updated;
}

export function contentCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, docs] of ensure()) {
    out[key] = docs.length;
  }
  return out;
}
