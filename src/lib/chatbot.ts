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
  /** Optional CTA href (e.g. /quote) */
  cta?: { label: string; href: string };
};

/** CMS-backed (or site.ts fallback) lists for FAQ + service matching. */
export type ChatbotFaq = { question: string; answer: string };
export type ChatbotService = { slug: string; title: string; details: string };
export type ChatbotCatalog = {
  faqs: ChatbotFaq[];
  fencingServices: ChatbotService[];
  deckServices: ChatbotService[];
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
};

const area = siteConfig.serviceArea;
const phone = siteConfig.phone;
const email = siteConfig.email;
const hours = `${siteConfig.hours.weekdays}; ${siteConfig.hours.saturday}; ${siteConfig.hours.sunday}`;

/** Primary chips — quotes, services, materials, service area (no financing/warranty). */
export const DEFAULT_SUGGESTIONS = [
  "Get a quote",
  "Fence services",
  "Materials",
  "Service area",
  "Hours & contact",
] as const;

export const WELCOME_REPLY: ChatReply = {
  text: `Hi — I'm the ${siteConfig.name} helper. Ask about fencing, materials, where we serve, or free estimates. Prefer a person? Call ${phone} or leave your number below.`,
  suggestions: [...DEFAULT_SUGGESTIONS],
};

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
  const fenceList = catalog.fencingServices.map((s) => s.title).join(", ");
  const deckList = catalog.deckServices.map((s) => s.title).join(", ");
  if (!q) {
    return {
      text: "Go ahead — ask about fences, decks, materials, where we work, or how to get a free quote.",
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
      text: `Hello! Thanks for reaching out to ${siteConfig.name}. What can I help with today?`,
      suggestions: [...DEFAULT_SUGGESTIONS],
    };
  }

  // Thanks / bye
  if (includesAny(q, ["thank", "thanks", "bye", "goodbye", "see you"])) {
    return {
      text: `You're welcome! Call ${phone} anytime, or request a free estimate on our quote page.`,
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
      text: `We offer free on-site estimates across ${area}. Share your name and phone below and we'll follow up — or jump to the full quote form. Prefer to talk now? Call ${phone}.`,
      collectLead: true,
      suggestions: ["Fence services", "Deck services", "Service area", "Materials"],
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
      text: `Call ${phone} or email ${email}. Hours: ${hours}. Based in ${siteConfig.address.city}, ${siteConfig.address.state}.`,
      suggestions: ["Get a quote", "Service area", "Fence services"],
      cta: { label: `Call ${phone}`, href: siteConfig.phoneHref },
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
      text: `${siteConfig.name} serves ${area}. Nearby and unsure? Leave your city with a quote request and we'll confirm.`,
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
      text: `${siteConfig.name} — ${siteConfig.tagline}. ${siteConfig.description} What homeowners value: ${points}.`,
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
      text: `Absolutely — leave your name, phone, and a short message below, or call us directly at ${phone}. Someone from ${siteConfig.name} will get back to you.`,
      collectLead: true,
      suggestions: ["Hours & contact", "Get a quote"],
      cta: { label: `Call ${phone}`, href: siteConfig.phoneHref },
    };
  }

  // Fallback — clear recovery paths
  return {
    text: `I didn't catch that. I can help with fence & deck services, materials, our service area (${area.split(",")[0]} & nearby), hours, or a free quote. Or call ${phone} and talk to the crew.`,
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

export function formatLeadConfirmation(lead: LeadPayload): string {
  return `Thanks, ${lead.name.trim()}! We've noted your info (${lead.phone.trim()}${
    lead.email.trim() ? `, ${lead.email.trim()}` : ""
  }). A ${siteConfig.name} team member will follow up soon. For the fastest response, call ${phone} or finish details on our quote page.`;
}
