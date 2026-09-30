import {
  deckServices as siteDeckServices,
  fencingServices as siteFenceTypes,
  faqs as siteFaqs,
  siteConfig,
  trustPoints,
} from "@/lib/site";

export type ChatRole = "bot" | "user" | "system";

export type ChatReply = {
  text: string;
  /** Suggested next actions shown as chips */
  suggestions?: string[];
  /** Prompt the UI to show lead-capture fields */
  collectLead?: boolean;
  /** Optional CTA href (prefer /contact for estimates) */
  cta?: { label: string; href: string };
};

/** CMS-backed (or site.ts fallback) lists for FAQ + service matching. */
export type ChatbotFaq = { question: string; answer: string };
export type ChatbotService = { slug: string; title: string; details: string };
export type ChatbotContact = {
  phone: string;
  phoneHref: string;
  email: string;
  serviceArea: string;
  hoursLine: string;
  addressCity?: string;
  addressState?: string;
};
export type ChatbotBrand = {
  name: string;
  tagline: string;
  description: string;
};
export type ChatbotCatalog = {
  faqs: ChatbotFaq[];
  fencingServices: ChatbotService[];
  deckServices: ChatbotService[];
  contact?: ChatbotContact;
  brand?: ChatbotBrand;
};

export const DEFAULT_CHATBOT_CONTACT: ChatbotContact = {
  phone: siteConfig.phone,
  phoneHref: siteConfig.phoneHref,
  email: siteConfig.email,
  serviceArea: siteConfig.serviceArea,
  hoursLine: `${siteConfig.hours.weekdays}; ${siteConfig.hours.saturday}; ${siteConfig.hours.sunday}`,
  addressCity: siteConfig.address.city,
  addressState: siteConfig.address.state,
};

export const DEFAULT_CHATBOT_BRAND: ChatbotBrand = {
  name: siteConfig.name,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
};

export const DEFAULT_CHATBOT_CATALOG: ChatbotCatalog = {
  faqs: siteFaqs.map((f) => ({ question: f.question, answer: f.answer })),
  fencingServices: siteFenceTypes.map((s) => ({
    slug: s.slug,
    title: s.title,
    details: s.details,
  })),
  deckServices: siteDeckServices.map((s) => ({
    slug: s.slug,
    title: s.title,
    details: s.details,
  })),
  contact: DEFAULT_CHATBOT_CONTACT,
  brand: DEFAULT_CHATBOT_BRAND,
};

/** Primary chips — quotes, services, materials, service area (no financing/warranty). */
export const DEFAULT_SUGGESTIONS = [
  "Get a quote",
  "Fence services",
  "Materials",
  "Service area",
  "Hours & contact",
] as const;

export function getWelcomeReply(
  catalog: ChatbotCatalog = DEFAULT_CHATBOT_CATALOG,
): ChatReply {
  const brand = catalog.brand ?? DEFAULT_CHATBOT_BRAND;
  const contact = catalog.contact ?? DEFAULT_CHATBOT_CONTACT;
  return {
    text: `Hi — quick answers from ${brand.name} about fencing, materials, and free estimates. Prefer a person? Call ${contact.phone} or open the estimate form.`,
    suggestions: [...DEFAULT_SUGGESTIONS],
  };
}

/** @deprecated Prefer getWelcomeReply(catalog) — kept for static import callers. */
export const WELCOME_REPLY: ChatReply = getWelcomeReply();

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9+\s#./-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(n));
}

function matchFaq(q: string, faqs: ChatbotFaq[]): string | null {
  for (const faq of faqs) {
    const nq = normalize(faq.question);
    const overlap = nq
      .split(" ")
      .filter((w) => w.length > 4 && q.includes(w)).length;
    if (overlap >= 2) return faq.answer;
    if (
      (q.includes("permit") || q.includes("hoa")) &&
      faq.question.toLowerCase().includes("permit")
    ) {
      return faq.answer;
    }
    if (
      (q.includes("how long") || q.includes("timeline") || q.includes("take")) &&
      faq.question.toLowerCase().includes("how long")
    ) {
      return faq.answer;
    }
    if (
      (q.includes("material") ||
        q.includes("weather") ||
        q.includes("cedar") ||
        q.includes("vinyl")) &&
      faq.question.toLowerCase().includes("materials")
    ) {
      return faq.answer;
    }
    if (
      q.includes("repair") &&
      q.includes("deck") &&
      !q.includes("fence") &&
      faq.question.toLowerCase().includes("repair an existing deck")
    ) {
      return faq.answer;
    }
    if (
      (q.includes("free estimate") ||
        (q.includes("estimate") && q.includes("free"))) &&
      faq.question.toLowerCase().includes("estimate really free")
    ) {
      return faq.answer;
    }
  }
  return null;
}

function matchServiceDetail(
  q: string,
  fencingServices: ChatbotService[],
  deckServices: ChatbotService[],
): string | null {
  for (const s of fencingServices) {
    const key = s.slug.replace(/-/g, " ");
    if (
      q.includes(key) ||
      q.includes(s.title.toLowerCase()) ||
      (s.slug === "chain-link" && q.includes("chain link")) ||
      (s.slug === "aluminum" &&
        (q.includes("ornamental") || q.includes("aluminum")))
    ) {
      return `${s.title}: ${s.details} Want a free on-site estimate? Leave your name and phone, or open our quote form.`;
    }
  }
  for (const s of deckServices) {
    const key = s.slug.replace(/-/g, " ");
    if (
      q.includes(key) ||
      q.includes(s.title.toLowerCase()) ||
      (s.slug === "new-builds" &&
        (q.includes("new deck") || q.includes("build a deck")))
    ) {
      return `${s.title}: ${s.details} Happy to arrange a free estimate — leave your contact info or visit the quote page.`;
    }
  }
  return null;
}

/** Rule-based assistant replies grounded in CMS catalog (site.ts fallback). */
export function getBotReply(
  rawInput: string,
  catalog: ChatbotCatalog = DEFAULT_CHATBOT_CATALOG,
): ChatReply {
  const q = normalize(rawInput);
  const contact = catalog.contact ?? DEFAULT_CHATBOT_CONTACT;
  const brand = catalog.brand ?? DEFAULT_CHATBOT_BRAND;
  const phone = contact.phone;
  const email = contact.email;
  const hours = contact.hoursLine;
  const area = contact.serviceArea;
  const phoneHref = contact.phoneHref;
  const addressCity = contact.addressCity ?? siteConfig.address.city;
  const addressState = contact.addressState ?? siteConfig.address.state;
  const fenceList = catalog.fencingServices.map((s) => s.title).join(", ");
  const deckList = catalog.deckServices.map((s) => s.title).join(", ");
  if (!q) {
    return {
      text: "Ask about fences, decks, materials, where we work, or a free estimate.",
      suggestions: [...DEFAULT_SUGGESTIONS],
    };
  }

  // Greetings
  if (
    includesAny(q, [
      "hello",
      "hi ",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
    ]) ||
    q === "hi"
  ) {
    return {
      text: `Hello — thanks for reaching out to ${brand.name}. What would you like to know?`,
      suggestions: [...DEFAULT_SUGGESTIONS],
    };
  }

  // Thanks / bye
  if (includesAny(q, ["thank", "thanks", "bye", "goodbye", "see you"])) {
    return {
      text: `You're welcome. Call ${phone} anytime, or request a free estimate on our contact page.`,
      suggestions: ["Get a quote", "Hours & contact", "Materials"],
      cta: { label: "Request a free estimate", href: "/contact" },
    };
  }

  // Lead / quote intent
  if (
    includesAny(q, [
      "quote",
      "estimate",
      "pricing",
      "price",
      "cost",
      "how much",
      "callback",
      "call me",
      "contact me",
      "leave my",
      "speak to",
      "talk to someone",
      "free estimate",
      "get a quote",
    ])
  ) {
    return {
      text: `Free on-site estimates across ${area}. The surest next step is our estimate form, or call ${phone}. You can also leave a name and phone below for a callback note.`,
      collectLead: true,
      suggestions: ["Fence services", "Service area", "Materials", "Hours & contact"],
      cta: { label: "Request a free estimate", href: "/contact" },
    };
  }

  // Hours / contact
  if (
    includesAny(q, [
      "hour",
      "open",
      "close",
      "when are you",
      "phone",
      "email",
      "call",
      "contact",
      "reach",
      "hours & contact",
    ])
  ) {
    return {
      text: `Call ${phone} or email ${email}. Hours: ${hours}. Based in ${addressCity}, ${addressState}.`,
      suggestions: ["Get a quote", "Service area", "Fence services"],
      cta: { label: `Call ${phone}`, href: phoneHref },
    };
  }

  // Service area
  if (
    includesAny(q, [
      "service area",
      "where do you",
      "do you serve",
      "near me",
      "location",
      "angier",
      "raleigh",
      "fuquay",
      "clayton",
      "holly springs",
      "wake county",
      "area",
      "towns",
      "cities",
      "garner",
      "cary",
      "apex",
    ])
  ) {
    return {
      text: `${brand.name} serves ${area}. Nearby and unsure? Leave your city with a quote request and we'll confirm.`,
      suggestions: ["Get a quote", "Hours & contact", "Fence services"],
      cta: { label: "Request a free estimate", href: "/contact" },
    };
  }

  // Materials guide
  if (
    includesAny(q, [
      "material",
      "cedar",
      "vinyl",
      "composite",
      "which wood",
      "aluminum fence",
      "pressure treated",
    ])
  ) {
    return {
      text: `We install cedar, pressure-treated wood, vinyl, aluminum/ornamental, chain-link, and composite decking chosen for Carolina weather. Compare options on our materials guide, or ask for samples during your free estimate.`,
      suggestions: ["Get a quote", "Fence services", "Deck services"],
      cta: { label: "Materials guide", href: "/materials" },
    };
  }

  // Payment / deposit — brief, no dedicated financing page
  if (
    includesAny(q, [
      "financ",
      "payment plan",
      "monthly payment",
      "deposit",
      "loan",
      "credit",
      "payment",
    ])
  ) {
    return {
      text: `Most projects use a deposit to schedule and balance at walkthrough. Payment details are covered during your free estimate — we don't process credit decisions on this site. Call ${phone} or request a quote and we'll walk you through options.`,
      suggestions: ["Get a quote", "Hours & contact"],
      cta: { label: "Request a free estimate", href: "/contact" },
    };
  }

  // Warranty / care — brief, no dedicated warranty page
  if (
    includesAny(q, ["warranty", "guarantee", "care tip", "maintain", "maintenance"])
  ) {
    return {
      text: `Workmanship coverage is spelled out on your contract; many materials (vinyl, aluminum, composite) also carry manufacturer warranties. We'll cover care tips on your estimate visit or after install — ask us anytime at ${phone}.`,
      suggestions: ["Get a quote", "Materials", "Hours & contact"],
      cta: { label: "Materials guide", href: "/materials" },
    };
  }

  // Trust / about
  if (includesAny(q, ["about", "why", "trust", "local", "who are"])) {
    const points = trustPoints.map((t) => t.label).join(" · ");
    return {
      text: `${brand.name} — ${brand.tagline}. ${brand.description} What homeowners value: ${points}.`,
      suggestions: ["Get a quote", "Fence services", "Deck services"],
      cta: { label: "About our crew", href: "/about" },
    };
  }

  // Process / how it works
  if (
    includesAny(q, [
      "how it works",
      "process",
      "what happens",
      "steps",
      "on-site",
      "on site",
    ])
  ) {
    return {
      text: "Here's how it works: (1) Request a free estimate online or by phone. (2) We visit for an on-site estimate with a clear written price. (3) Our crew builds or repairs on schedule and cleans up. Ready to start?",
      suggestions: ["Get a quote", "Hours & contact", "Materials"],
      cta: { label: "Request a free estimate", href: "/contact" },
    };
  }

  // Specific service match
  const detail = matchServiceDetail(
    q,
    catalog.fencingServices,
    catalog.deckServices,
  );
  if (detail) {
    return {
      text: detail,
      suggestions: ["Get a quote", "Fence services", "Deck services", "Materials"],
      cta: { label: "Request a free estimate", href: "/contact" },
      collectLead: includesAny(q, ["quote", "estimate", "price", "cost"]),
    };
  }

  // Fence category
  if (includesAny(q, ["fence", "fencing", "privacy", "picket", "gate"])) {
    return {
      text: `Our fencing services include: ${fenceList}. Most residential installs finish in one to three days once materials are on site. Tell me which style you're considering, or ask for a free estimate.`,
      suggestions: [
        "Wood fencing",
        "Vinyl fencing",
        "Privacy fencing",
        "Get a quote",
      ],
    };
  }

  // Deck category
  if (includesAny(q, ["deck", "railing", "stair", "porch"])) {
    return {
      text: `Our deck work covers: ${deckList}. We can often repair a sound structure instead of replacing it — we'll inspect framing and railings first. Want a free on-site look?`,
      suggestions: [
        "Deck repair",
        "New deck builds",
        "Railings & stairs",
        "Get a quote",
      ],
    };
  }

  // FAQ overlap
  const faqAnswer = matchFaq(q, catalog.faqs);
  if (faqAnswer) {
    return {
      text: faqAnswer,
      suggestions: ["Get a quote", "Fence services", "Materials"],
      cta: { label: "Request a free estimate", href: "/contact" },
    };
  }

  // Human handoff
  if (
    includesAny(q, [
      "human",
      "person",
      "real person",
      "agent",
      "representative",
      "talk to a",
    ])
  ) {
    return {
      text: `Of course — call ${phone}, or open the estimate form. You can also leave a name and phone below as a callback note.`,
      collectLead: true,
      suggestions: ["Hours & contact", "Get a quote"],
      cta: { label: `Call ${phone}`, href: phoneHref },
    };
  }

  // Fallback — clear recovery paths
  return {
    text: `I didn't catch that. Try fence or deck services, materials, our service area (${area.split(",")[0]} & nearby), hours, or a free estimate — or call ${phone}.`,
    suggestions: [...DEFAULT_SUGGESTIONS],
    cta: { label: "Request a free estimate", href: "/contact" },
  };
}

export type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export function formatLeadConfirmation(
  lead: LeadPayload,
  catalog: ChatbotCatalog = DEFAULT_CHATBOT_CATALOG,
): string {
  const contact = catalog.contact ?? DEFAULT_CHATBOT_CONTACT;
  return `Thanks, ${lead.name.trim()}. We saved your note here (${lead.phone.trim()}${
    lead.email.trim() ? `, ${lead.email.trim()}` : ""
  }). Chat notes are not delivered to our office yet — please call ${contact.phone} or finish the free estimate form so we receive your request.`;
}
