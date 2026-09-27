import {
  deckServices,
  fencingServices,
  faqs,
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

const fenceList = fencingServices.map((s) => s.title).join(", ");
const deckList = deckServices.map((s) => s.title).join(", ");
const area = siteConfig.serviceArea;
const phone = siteConfig.phone;
const email = siteConfig.email;
const hours = `${siteConfig.hours.weekdays}; ${siteConfig.hours.saturday}; ${siteConfig.hours.sunday}`;

const DEFAULT_SUGGESTIONS = [
  "Fence services",
  "Deck services",
  "Service area",
  "Get a quote",
  "Hours & contact",
];

export const WELCOME_REPLY: ChatReply = {
  text: `Hi! I'm the ${siteConfig.name} helper. I can answer questions about fences, decks, our service area, hours, and free estimates — or help you leave your contact info for a callback.`,
  suggestions: DEFAULT_SUGGESTIONS,
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

function matchFaq(q: string): string | null {
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
      (q.includes("material") || q.includes("weather") || q.includes("cedar") || q.includes("vinyl")) &&
      faq.question.toLowerCase().includes("materials")
    ) {
      return faq.answer;
    }
    if (
      (q.includes("repair") && q.includes("deck") && !q.includes("fence")) &&
      faq.question.toLowerCase().includes("repair an existing deck")
    ) {
      return faq.answer;
    }
  }
  return null;
}

function matchServiceDetail(q: string): string | null {
  for (const s of fencingServices) {
    const key = s.slug.replace(/-/g, " ");
    if (
      q.includes(key) ||
      q.includes(s.title.toLowerCase()) ||
      (s.slug === "chain-link" && q.includes("chain link")) ||
      (s.slug === "aluminum" && (q.includes("ornamental") || q.includes("aluminum")))
    ) {
      return `${s.title}: ${s.details} Want a free on-site estimate? I can take your name and phone, or you can open our quote form.`;
    }
  }
  for (const s of deckServices) {
    const key = s.slug.replace(/-/g, " ");
    if (
      q.includes(key) ||
      q.includes(s.title.toLowerCase()) ||
      (s.slug === "new-builds" && (q.includes("new deck") || q.includes("build a deck")))
    ) {
      return `${s.title}: ${s.details} Happy to arrange a free estimate — leave your contact info or visit the quote page.`;
    }
  }
  return null;
}

/** Rule-based assistant replies grounded in site.ts content. */
export function getBotReply(rawInput: string): ChatReply {
  const q = normalize(rawInput);
  if (!q) {
    return {
      text: "Go ahead and ask about fences, decks, where we work, or how to get a free quote.",
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  // Greetings
  if (
    includesAny(q, ["hello", "hi ", "hey", "good morning", "good afternoon", "good evening"]) ||
    q === "hi"
  ) {
    return {
      text: `Hello! Thanks for reaching out to ${siteConfig.name}. What can I help with today?`,
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  // Thanks / bye
  if (includesAny(q, ["thank", "thanks", "bye", "goodbye", "see you"])) {
    return {
      text: `You're welcome! Call us at ${phone} anytime, or request a free estimate on our quote page.`,
      suggestions: ["Get a quote", "Hours & contact"],
      cta: { label: "Get a free quote", href: "/quote" },
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
    ])
  ) {
    return {
      text: `We offer free on-site estimates across ${area}. Share your name, phone, and email below and we'll follow up — or jump straight to the full quote form.`,
      collectLead: true,
      suggestions: ["Fence services", "Deck services", "Service area"],
      cta: { label: "Open quote form", href: "/quote" },
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
    ])
  ) {
    return {
      text: `You can reach us at ${phone} or ${email}. Hours: ${hours}. We're based in ${siteConfig.address.city}, ${siteConfig.address.state}.`,
      suggestions: ["Get a quote", "Service area", "Fence services"],
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
    ])
  ) {
    return {
      text: `${siteConfig.name} serves ${area}. If you're nearby and unsure, leave your city with a quote request and we'll confirm.`,
      suggestions: ["Get a quote", "Hours & contact", "Fence services"],
      cta: { label: "Request a quote", href: "/quote" },
    };
  }

  // Materials guide
  if (includesAny(q, ["material", "cedar", "vinyl", "composite", "which wood", "aluminum fence"])) {
    return {
      text: `We install cedar, pressure-treated wood, vinyl, aluminum/ornamental, chain-link, and composite decking chosen for Carolina weather. Compare options on our materials guide, or ask for samples during your free estimate.`,
      suggestions: ["Get a quote", "Fence services", "Deck services"],
      cta: { label: "Materials guide", href: "/materials" },
    };
  }

  // Financing
  if (includesAny(q, ["financ", "payment plan", "monthly payment", "deposit", "loan", "credit"])) {
    return {
      text: `Most projects use a deposit to schedule and balance at walkthrough. Phased scopes are sometimes possible. Optional third-party financing—when available—is between you and the lender; we don't run credit decisions on this site. See our financing page for details.`,
      suggestions: ["Get a quote", "Hours & contact"],
      cta: { label: "Financing options", href: "/financing" },
    };
  }

  // Warranty / care
  if (includesAny(q, ["warranty", "guarantee", "care tip", "maintain", "maintenance"])) {
    return {
      text: `We stand behind our workmanship as stated on your contract, and manufacturer warranties often cover materials like vinyl, aluminum, and composite. Care tips for wood, vinyl, and decks are on our warranty & care page.`,
      suggestions: ["Get a quote", "Materials", "Hours & contact"],
      cta: { label: "Warranty & care", href: "/warranty" },
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
  if (includesAny(q, ["how it works", "process", "what happens", "steps", "on-site", "on site"])) {
    return {
      text: "Here's how it works: (1) Request a quote online or by phone. (2) We visit for an on-site estimate with a clear written price. (3) Our crew builds or repairs on schedule and cleans up. Ready to start?",
      suggestions: ["Get a quote", "Hours & contact"],
      cta: { label: "Get a free quote", href: "/quote" },
    };
  }

  // Specific service match
  const detail = matchServiceDetail(q);
  if (detail) {
    return {
      text: detail,
      suggestions: ["Get a quote", "Fence services", "Deck services"],
      cta: { label: "Get a free quote", href: "/quote" },
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
  const faqAnswer = matchFaq(q);
  if (faqAnswer) {
    return {
      text: faqAnswer,
      suggestions: ["Get a quote", "Fence services", "Deck services"],
      cta: { label: "Get a free quote", href: "/quote" },
    };
  }

  // Human handoff
  if (includesAny(q, ["human", "person", "real person", "agent", "representative"])) {
    return {
      text: `Absolutely — leave your name, phone, and a short message below, or call us directly at ${phone}. Someone from ${siteConfig.name} will get back to you.`,
      collectLead: true,
      suggestions: ["Hours & contact", "Get a quote"],
    };
  }

  // Fallback
  return {
    text: `I'm not sure I caught that. I can help with fence & deck services, our service area (${area.split(",")[0]} & nearby), hours, or getting a free quote. You can also call ${phone}.`,
    suggestions: DEFAULT_SUGGESTIONS,
    cta: { label: "Get a free quote", href: "/quote" },
  };
}

export type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export function formatLeadConfirmation(lead: LeadPayload): string {
  return `Thanks, ${lead.name.trim()}! We've noted your info (${lead.phone.trim()}${lead.email.trim() ? `, ${lead.email.trim()}` : ""}). A ${siteConfig.name} team member will follow up soon. For the fastest response, call ${phone} or finish details on our quote page.`;
}
