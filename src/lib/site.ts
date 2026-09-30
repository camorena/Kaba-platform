/**
 * Public marketing content (primary source for the live site).
 *
 * CMS: admin Phase A–C under src/lib/cms/ and /admin/content.
 * Partial cutovers (CMS published → site.ts fallback):
 *   getPublishedFaqs() → /faq
 *   getPublishedTestimonials() → /reviews + home
 *   getPublishedProjects() → /gallery + home teaser
 *   getPublishedFenceTypes/Services() → /services, residential/commercial, home
 *   getPublishedAbout* / ServiceTowns / Materials* (+ FAQs) → /about, /service-area, /materials
 *   getPublishedProcessTimeline() → /how-it-works (process.* site-copy)
 *   getPublishedHeroCopy / TrustPoints / YourNeeds / KabaExperience → home (+ residential needs)
 *   getPublishedNavLinks / FooterLinks / FencingOptionsNav / LegalLinks / ContactInfo
 *     → header/footer chrome (+ legal) + contact CTAs across marketing/pay/404/mail
 *   getPublishedHeroCopy (name/tagline/description) + ContactInfo address/social
 *     → metadata/OG, footer brand/region/social, pay chrome, JSON-LD, invoice letterhead,
 *       header logo label, page metadata/body copy, chatbot/ChatWidget, QuoteForm, notify subjects
 *   JSON-LD areaServed ← getPublishedServiceTowns()
 *   Chatbot catalog ← getPublishedFaqs / FenceTypes / Services (+ contact + brand)
 * Do not delete other exports until each type follows the swap path in
 * preview/CMS_PUBLIC_CONTENT_PLAN.md (getPublished* + one page at a time).
 */

export type SocialNetwork = "facebook" | "instagram" | "linkedin";

const socialHosts: Record<SocialNetwork, ReadonlySet<string>> = {
  facebook: new Set(["facebook.com", "www.facebook.com", "m.facebook.com"]),
  instagram: new Set(["instagram.com", "www.instagram.com"]),
  linkedin: new Set(["linkedin.com", "www.linkedin.com"]),
};

/**
 * Return only a complete profile URL for a known social network.
 * Empty values and provider roots are intentionally treated as unpublished.
 */
export function getSocialProfileUrl(
  network: SocialNetwork,
  value: string | null | undefined,
): string {
  const candidate = value?.trim();
  if (!candidate) return "";

  try {
    const url = new URL(candidate);
    const hasProfilePath = url.pathname.split("/").some(Boolean);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      !socialHosts[network].has(url.hostname.toLowerCase()) ||
      !hasProfilePath
    ) {
      return "";
    }
  } catch {
    return "";
  }

  return candidate;
}

export const siteConfig = {
  name: "Kaba Fence",
  tagline: "We Listen. We Guide. We Build. We Care.",
  description:
    "Professional fencing in Raleigh, NC & surrounding areas, with personalized guidance from start to finish.",
  serviceArea: "Raleigh, NC & surrounding areas",
  phone: "(919) 292-4777",
  phoneHref: "tel:+19192924777",
  email: "kabafencellc@gmail.com",
  emailHref: "mailto:kabafencellc@gmail.com",
  hours: {
    weekdays: "Monday – Friday: 8:00 AM – 5:00 PM",
    saturday: "Saturday: By appointment",
    sunday: "Sunday: Closed",
  },
  address: {
    city: "Raleigh",
    state: "NC",
    zip: "",
    region: "Angier, Raleigh & Surrounding Areas",
  },
  heroLabel: "Fence Company in Angier, Raleigh & Surrounding Areas",
  heroHeadline: "A Better Fence Starts With a Better Experience.",
  heroSub:
    "Professional fencing in Raleigh, NC & surrounding areas, with personalized guidance from start to finish.",
  social: {
    // Keep unset until the business supplies real profile URLs.
    facebook: "",
    instagram: "",
    linkedin: "",
  },
} as const;

/** Primary header nav matching client mockup. */
export const navLinks = [
  { href: "/residential", label: "Residential" },
  { href: "/commercial", label: "Commercial" },
  { href: "/services", label: "Fencing", hasDropdown: true },
  { href: "/gallery", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const fencingOptionsNav = [
  { href: "/services#wood", label: "Wood Fencing", slug: "wood" },
  { href: "/services#vinyl", label: "Vinyl Fencing", slug: "vinyl" },
  { href: "/services#aluminum", label: "Aluminum Fencing", slug: "aluminum" },
  { href: "/services#chain-link", label: "Chain Link Fencing", slug: "chain-link" },
] as const;

/** Secondary links — footer extras. */
export const footerLinks = [
  { href: "/materials", label: "Materials guide" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/service-area", label: "Service area" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
] as const;

export const fencingServices = [
  {
    slug: "wood",
    title: "Wood Fencing",
    tagline: "Privacy · Natural · Customizable",
    summary:
      "Classic privacy and picket fences built with quality lumber for lasting curb appeal.",
    details:
      "From cedar privacy panels to traditional picket styles, we install and repair wood fences that stand up to Carolina weather and look great for years.",
    image: "/gallery/cedar-privacy.jpg",
  },
  {
    slug: "vinyl",
    title: "Vinyl Fencing",
    tagline: "Privacy · Low Maintenance · Clean",
    summary:
      "Low-maintenance vinyl that keeps its color and never needs staining or painting.",
    details:
      "Ideal for busy homeowners who want privacy and style without the upkeep. Available in white, tan, and other popular finishes.",
    image: "/gallery/vinyl-privacy.jpg",
  },
  {
    slug: "aluminum",
    title: "Aluminum Fencing",
    tagline: "Elegant · Durable · Open",
    summary:
      "Elegant, rust-resistant aluminum that adds security without blocking the view.",
    details:
      "Ornamental aluminum and iron-look styles that elevate your property while keeping kids and pets safely inside.",
    image: "/gallery/aluminum-ornamental.jpg",
  },
  {
    slug: "chain-link",
    title: "Chain Link Fencing",
    tagline: "Practical · Secure · Cost-Conscious",
    summary:
      "Durable, affordable security fencing for yards, pets, and commercial lots.",
    details:
      "Galvanized and vinyl-coated options. Great for pet containment, sports courts, and secure perimeters.",
    image: "/gallery/chain-link.jpg",
  },
] as const;

export const deckServices = [
  {
    slug: "repair",
    title: "Deck Repair",
    summary:
      "Fix loose boards, wobbly railings, and weather damage before they become safety issues.",
    details:
      "We inspect, reinforce, and restore decks so you can enjoy your outdoor space with confidence.",
  },
  {
    slug: "rebuild",
    title: "Deck Rebuilds",
    summary:
      "Full rebuilds when your structure has reached the end of its safe life.",
    details:
      "We carefully remove the old deck and rebuild to current code with stronger framing and better materials.",
  },
  {
    slug: "new-builds",
    title: "New Deck Builds",
    summary:
      "Custom decks designed around how you live—entertaining, grilling, or quiet evenings.",
    details:
      "Pressure-treated, cedar, and composite options with layouts tailored to your home and yard.",
  },
  {
    slug: "railings",
    title: "Railings & Stairs",
    summary:
      "Safe, code-compliant railings and stair systems that match your deck style.",
    details:
      "Wood, aluminum, and cable railing upgrades that improve safety and finish the look.",
  },
] as const;

export const yourNeeds = [
  {
    id: "pets",
    title: "A Safer Yard for Your Pets",
    description: "Secure spaces for more freedom and peace of mind.",
    image: "/gallery/cedar-privacy.jpg",
    icon: "paw" as const,
  },
  {
    id: "privacy",
    title: "More Privacy at Home",
    description: "Create a private, comfortable space for your family.",
    image: "/gallery/vinyl-privacy.jpg",
    icon: "home" as const,
  },
  {
    id: "repair",
    title: "Repair What You Already Have",
    description: "Restore function without replacing more than necessary.",
    image: "/gallery/deck-repair.jpg",
    icon: "wrench" as const,
  },
] as const;

export const kabaExperience = [
  {
    id: "listen",
    title: "We Listen",
    description: "Your needs come first.",
    icon: "listen" as const,
  },
  {
    id: "guide",
    title: "We Guide",
    description: "Clear options. Honest guidance.",
    icon: "guide" as const,
  },
  {
    id: "build",
    title: "We Build",
    description: "Professional craftsmanship. Attention to detail.",
    icon: "build" as const,
  },
  {
    id: "care",
    title: "We Care",
    description: "Support before, during and after installation.",
    icon: "care" as const,
  },
] as const;

export const galleryProjects = [
  {
    id: "cedar-privacy",
    title: "Cedar Privacy Fence — Raleigh",
    category: "fence" as const,
    image: "/gallery/cedar-privacy.jpg",
    caption: "Cedar privacy fence — Raleigh",
    beforeImage: "/gallery/before/cedar-privacy.jpg",
    beforeCaption: "Tired, uneven privacy line before replacement",
  },
  {
    id: "vinyl-privacy",
    title: "White Vinyl Privacy — Raleigh Area",
    category: "fence" as const,
    image: "/gallery/vinyl-privacy.jpg",
    caption: "White vinyl privacy — Raleigh area",
    beforeImage: "/gallery/before/vinyl-privacy.jpg",
    beforeCaption: "Dated wood run prior to low-maintenance vinyl",
  },
  {
    id: "aluminum-ornamental",
    title: "Aluminum Ornamental — Wake County",
    category: "fence" as const,
    image: "/gallery/aluminum-ornamental.jpg",
    caption: "Aluminum ornamental — Wake County",
  },
  {
    id: "chain-link",
    title: "Chain-Link Enclosure — Raleigh Area",
    category: "fence" as const,
    image: "/gallery/chain-link.jpg",
    caption: "Chain-link enclosure — Raleigh area",
  },
  {
    id: "deck-new-build",
    title: "New Elevated Deck — Raleigh Area",
    category: "deck" as const,
    image: "/gallery/deck-new-build.jpg",
    caption: "New elevated deck — Raleigh area",
    beforeImage: "/gallery/before/deck-new-build.jpg",
    beforeCaption: "Worn deck surface before rebuild",
  },
  {
    id: "deck-repair",
    title: "Deck Repair & Railing Refresh — Raleigh",
    category: "deck" as const,
    image: "/gallery/deck-repair.jpg",
    caption: "Deck repair & railing refresh — Raleigh",
  },
] as const;

export const howItWorks = [
  {
    step: "1",
    title: "Request a Quote",
    description:
      "Tell us about your fence project online or by phone. We serve Raleigh, NC and surrounding areas.",
  },
  {
    step: "2",
    title: "On-Site Estimate",
    description:
      "We visit your property, measure carefully, discuss materials and styles, and give you a clear written estimate.",
  },
  {
    step: "3",
    title: "Build & Finish",
    description:
      "Our crew installs or repairs your project on schedule, cleans up the job site, and walks you through the finished work.",
  },
] as const;

export const processTimeline = [
  {
    step: "01",
    title: "Estimate",
    eyebrow: "Free on-site visit",
    description:
      "Share your goals online or by phone. We schedule a free visit, measure carefully, and deliver a clear written estimate with material options for Raleigh-area homes.",
  },
  {
    step: "02",
    title: "Design",
    eyebrow: "Materials & layout",
    description:
      "Together we lock in style, height, gates, and finishes—wood, vinyl, chain-link, or aluminum—plus any HOA or permit considerations for your neighborhood.",
  },
  {
    step: "03",
    title: "Build",
    eyebrow: "Crafted on schedule",
    description:
      "Our local crew installs or repairs on the agreed timeline. We protect landscaping, set posts properly, and keep the job site organized every day.",
  },
  {
    step: "04",
    title: "Walkthrough",
    eyebrow: "Clean finish",
    description:
      "We walk the finished fence with you, adjust gates and hardware, haul debris, and make sure everything feels solid before we leave.",
  },
] as const;

export const trustPoints = [
  { label: "Local & Family-Owned", icon: "home" as const },
  { label: "Licensed & Insured", icon: "shield" as const },
  { label: "Angier, Raleigh & Surrounding Areas", icon: "pin" as const },
] as const;

export const aboutLocalTrust = [
  {
    title: "Local to Angier & Raleigh",
    description:
      "Home-based in Angier with regular projects across Raleigh and nearby Wake & Harnett towns—neighbors, not a national call center.",
  },
  {
    title: "Free on-site estimates",
    description:
      "We measure carefully, talk materials in plain language, and leave you with a clear written quote—no obligation.",
  },
  {
    title: "Materials that last here",
    description:
      "Cedar, vinyl, aluminum, and chain link specified for Carolina heat, humidity, and storms—not generic catalog picks.",
  },
  {
    title: "Clean job sites",
    description:
      "Protect landscaping, haul debris, and walk the finished line with you so neighbors notice the fence—not the mess.",
  },
] as const;

export const aboutStats = [
  { value: "Angier", label: "Home base · Harnett County" },
  { value: "Raleigh+", label: "Triangle-edge coverage" },
  { value: "Licensed", label: "Insured local crew" },
  { value: "Free", label: "On-site estimates" },
] as const;

export const companyValues = [
  {
    title: "We listen first",
    description:
      "Your goals for privacy, pets, curb appeal, or repairs come first. We ask the right questions before we recommend a fence.",
  },
  {
    title: "Clear, honest guidance",
    description:
      "Written estimates with materials, scope, and timeline spelled out. No vague ranges, no surprise line items after the posts are set.",
  },
  {
    title: "Built for Carolina weather",
    description:
      "We specify lumber, fasteners, and finishes that hold up to heat, humidity, and storms—so your fence lasts.",
  },
  {
    title: "Support after install",
    description:
      "We’re here before, during, and after installation. Job sites left clean. Neighbors should notice the new fence—not the mess.",
  },
] as const;

export const serviceTowns = [
  {
    name: "Raleigh",
    region: "Wake County",
    note: "Privacy fences, ornamental aluminum, and residential projects for in-town and suburban homes.",
  },
  {
    name: "Apex",
    region: "Wake County",
    note: "Wood and vinyl fencing with clean installs for suburban yards.",
  },
  {
    name: "Holly Springs",
    region: "Wake County",
    note: "HOA-friendly vinyl and wood privacy systems.",
  },
  {
    name: "Cary",
    region: "Wake County",
    note: "Select ornamental and privacy projects where schedule and access allow.",
  },
  {
    name: "Fuquay-Varina",
    region: "Wake County",
    note: "New builds and replacements for growing neighborhoods and larger backyard lots.",
  },
  {
    name: "Garner",
    region: "Wake County",
    note: "Fence replacements and refreshes for established neighborhoods.",
  },
  {
    name: "Clayton",
    region: "Johnston County",
    note: "Chain-link, wood privacy, and repairs for homes east of Raleigh.",
  },
  {
    name: "Knightdale",
    region: "Wake County",
    note: "Privacy and chain-link installs for east Wake communities.",
  },
  {
    name: "Wake Forest",
    region: "Wake County",
    note: "Select projects in northern Wake—ask us about current scheduling.",
  },
  {
    name: "Angier",
    region: "Harnett County",
    note: "Fence installs and repairs across town and nearby rural lots.",
  },
  {
    name: "Dunn",
    region: "Harnett County",
    note: "Rural and in-town fence lines and pet enclosures.",
  },
  {
    name: "Lillington",
    region: "Harnett County",
    note: "Fence work for Harnett County homeowners south of the Triangle.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Excellent communication and beautiful work. Our backyard privacy fence looks amazing and the crew left everything spotless.",
    name: "Sarah M.",
    town: "Apex, NC",
  },
  {
    quote:
      "From the estimate to the final walkthrough, everything was easy. Clear pricing, on-time crew, and a fence we’re proud of.",
    name: "Michael R.",
    town: "Raleigh, NC",
  },
  {
    quote:
      "Great experience! The team was respectful of our property, answered every question, and finished ahead of schedule.",
    name: "Jennifer T.",
    town: "Holly Springs, NC",
  },
  {
    quote:
      "We needed vinyl privacy that would pass HOA review. Kaba walked us through options, got it approved, and installed it cleanly.",
    name: "Jordan M.",
    town: "Cary, NC",
  },
  {
    quote:
      "Storm damage took out a section of our fence. They matched the existing panels and had us secure again within the week.",
    name: "Pat & Elena S.",
    town: "Garner, NC",
  },
  {
    quote:
      "Professional from start to finish. Honest guidance on materials and a fence that feels solid for our dogs.",
    name: "Marcus W.",
    town: "Raleigh, NC",
  },
] as const;

export const faqs = [
  {
    question: "How long does a typical fence installation take?",
    answer:
      "Most residential fence projects wrap up in one to three days once materials are on site. Longer runs, steep grades, or HOA review can add time. We'll give you a clear schedule with your written estimate.",
  },
  {
    question: "Do you handle permits and HOA approvals?",
    answer:
      "We help you understand local permit and HOA requirements for Raleigh and nearby towns. When a permit is needed, we'll guide the paperwork and build to the approved plan.",
  },
  {
    question: "What materials hold up best in North Carolina weather?",
    answer:
      "Cedar and pressure-treated wood, vinyl, and powder-coated aluminum all perform well here. The right choice depends on privacy goals, budget, and how much maintenance you want. We'll walk you through options on site.",
  },
  {
    question: "Can you repair an existing fence instead of replacing it?",
    answer:
      "Often yes. We inspect posts, panels, and gates first. If the structure is sound, targeted repairs can restore function and look without a full replacement.",
  },
  {
    question: "What towns do you serve?",
    answer:
      "We serve Raleigh, NC and surrounding areas including Apex, Holly Springs, Cary, Fuquay-Varina, Garner, Clayton, Knightdale, Wake Forest, and nearby communities. If you’re close and unsure, call—we’ll let you know.",
  },
  {
    question: "Is the estimate really free?",
    answer:
      "Yes. On-site estimates for residential fence projects are free and no-obligation. You’ll leave with a written scope and price so you can decide on your timeline.",
  },
  {
    question: "How do I prepare for install day?",
    answer:
      "Clear access along the fence line when you can, note underground utilities we’ve already marked through 811, and let us know about pets or locked gates. We’ll confirm details before we arrive.",
  },
  {
    question: "Do you build gates and hardware upgrades?",
    answer:
      "Absolutely. New gates, latch and hinge upgrades, and walk-through or driveway openings are part of many fence projects—and we can add them to an existing fence when it makes sense.",
  },
] as const;

/** Canonical production origin (metadataBase, sitemap, JSON-LD, analytics). */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
  "https://kaba-platform.vercel.app"
);

/** Absolute URL helper for sitemap / JSON-LD. */
export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** All public indexable routes for sitemap. */
export const sitemapRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/residential", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/commercial", changeFrequency: "monthly" as const, priority: 0.85 },
  { path: "/services", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/gallery", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/quote", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/reviews", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/service-area", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/how-it-works", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/materials", changeFrequency: "monthly" as const, priority: 0.75 },
  { path: "/faq", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
] as const;

/** Default Open Graph / Twitter image used across marketing pages. */
export const defaultOgImage = {
  url: "/gallery/cedar-privacy.jpg",
  width: 1280,
  height: 720,
  alt: "Wood privacy fence installation by Kaba Fence in Raleigh, NC",
} as const;

/** Primary fence materials featured on /materials (wood / vinyl / aluminum / chain link). */
export const fenceMaterials = [
  {
    id: "wood",
    name: "Wood",
    tagline: "Privacy · Natural · Customizable",
    bestFor: "Classic privacy, picket, and warm curb appeal",
    lifespan: "15–25 years with care",
    maintenance: "Seal or stain every few years",
    privacy: "Full",
    upkeep: "Moderate",
    costTier: "$$",
    servicesHref: "/services#wood",
    image: "/gallery/cedar-privacy.jpg",
    pros: ["Natural look & custom stains", "Full privacy options", "Cedar resists insects & rot"],
    cons: ["Periodic finish work", "Lumber cost varies by species"],
    tip: "Cedar for premium privacy; pressure-treated pine when budget leads—sized posts for Carolina humidity.",
  },
  {
    id: "vinyl",
    name: "Vinyl",
    tagline: "Privacy · Low maintenance · Clean",
    bestFor: "HOA neighborhoods and set-it-and-forget-it privacy",
    lifespan: "20–30+ years",
    maintenance: "Occasional rinse—no staining or painting",
    privacy: "Full",
    upkeep: "Low",
    costTier: "$$$",
    servicesHref: "/services#vinyl",
    image: "/gallery/vinyl-privacy.jpg",
    pros: ["Color-stable panels", "Easy to clean", "Consistent, polished look"],
    cons: ["Higher upfront cost", "Needs quality posts & wall thickness"],
    tip: "We specify thicker walls and proper posts so panels stay straight through summer heat.",
  },
  {
    id: "aluminum",
    name: "Aluminum",
    tagline: "Elegant · Durable · Open",
    bestFor: "View-preserving security and front-yard elegance",
    lifespan: "25–40+ years",
    maintenance: "Rinse occasionally; powder coat resists rust",
    privacy: "Open",
    upkeep: "Very low",
    costTier: "$$$",
    servicesHref: "/services#aluminum",
    image: "/gallery/aluminum-ornamental.jpg",
    pros: ["Rust-resistant", "Open sight lines", "Pet & pool friendly"],
    cons: ["Not full privacy", "Premium vs. chain-link"],
    tip: "Pair with landscaping for soft privacy without blocking breezes or views.",
  },
  {
    id: "chain-link",
    name: "Chain Link",
    tagline: "Practical · Secure · Cost-conscious",
    bestFor: "Pets, side yards, and secure perimeters on a budget",
    lifespan: "15–30 years (coated lasts longer visually)",
    maintenance: "Check tension & posts after storms",
    privacy: "Open / slatted",
    upkeep: "Low",
    costTier: "$",
    servicesHref: "/services#chain-link",
    image: "/gallery/chain-link.jpg",
    pros: ["Affordable", "Fast install", "Durable security"],
    cons: ["Industrial look", "Limited privacy unless slatted"],
    tip: "Vinyl-coated mesh and privacy slats upgrade curb appeal without losing strength.",
  },
] as const;

/** Quick comparison rows for the materials guidance table. */
export const materialComparison = [
  {
    id: "wood",
    name: "Wood",
    privacy: "Full",
    maintenance: "Moderate",
    lifespan: "15–25 yrs",
    bestWhen: "You want classic curb appeal and custom stain colors",
  },
  {
    id: "vinyl",
    name: "Vinyl",
    privacy: "Full",
    maintenance: "Low",
    lifespan: "20–30+ yrs",
    bestWhen: "HOA rules and weekends without upkeep matter most",
  },
  {
    id: "aluminum",
    name: "Aluminum",
    privacy: "Open",
    maintenance: "Very low",
    lifespan: "25–40+ yrs",
    bestWhen: "You need security without blocking the view",
  },
  {
    id: "chain-link",
    name: "Chain Link",
    privacy: "Open / slatted",
    maintenance: "Low",
    lifespan: "15–30 yrs",
    bestWhen: "Budget, pets, or a long secure perimeter come first",
  },
] as const;

/** Choosing guidance chips for /materials. */
export const materialGuidance = [
  {
    title: "Need full privacy?",
    body: "Start with wood or vinyl. Both give solid sight-line coverage for backyard living.",
  },
  {
    title: "Want zero staining?",
    body: "Vinyl or powder-coated aluminum keep color without annual finish work.",
  },
  {
    title: "Watching the budget?",
    body: "Pressure-treated wood and chain-link stretch dollars—still built to last in NC weather.",
  },
  {
    title: "Pool or pet codes?",
    body: "Aluminum and coated chain-link often satisfy height and opening rules cleanly.",
  },
] as const;

export const deckMaterials = [
  {
    id: "pt-deck",
    name: "Pressure-treated lumber",
    bestFor: "Value-focused new decks and repairs",
    lifespan: "10–20 years with sealing",
    maintenance: "Clean & reseal regularly; replace boards as needed",
    pros: ["Lowest material cost", "Easy to repair locally", "Strong framing"],
    cons: ["Splits/checks over time", "Needs more upkeep"],
    tip: "We still use PT for most framing—even under composite—because it holds fasteners well in NC soil conditions.",
  },
  {
    id: "cedar-deck",
    name: "Cedar decking",
    bestFor: "Warm natural decks with lighter foot feel",
    lifespan: "15–25 years with care",
    maintenance: "Clean; oil or stain to keep color",
    pros: ["Beautiful grain", "Naturally resistant", "Comfortable underfoot"],
    cons: ["Softer than composite", "Periodic finish work"],
    tip: "Looks especially good with cable or aluminum railings for a clean modern contrast.",
  },
  {
    id: "composite",
    name: "Composite / capped polymer",
    bestFor: "Low-maintenance entertaining decks",
    lifespan: "25–30+ years (brand dependent)",
    maintenance: "Soap-and-water cleaning; no staining",
    pros: ["Fade & stain resistant", "Consistent boards", "Long warranties"],
    cons: ["Higher upfront cost", "Can get warm in full sun"],
    tip: "We help pick colors that hide Carolina pine pollen and hold up to afternoon sun.",
  },
] as const;

export const materialFaqs = [
  {
    question: "Which fence material is best for North Carolina weather?",
    answer:
      "Cedar, quality pressure-treated pine, vinyl, and powder-coated aluminum all perform well here. The right pick depends on privacy goals, budget, and how much maintenance you want. We’ll walk options on site with samples when it helps.",
  },
  {
    question: "Do you help with HOA material requirements?",
    answer:
      "Yes. Many Wake County HOAs prefer certain vinyl colors or wood styles. Share your guidelines early—we’ll quote materials that are more likely to pass review.",
  },
  {
    question: "Can I mix materials—like wood privacy with aluminum gates?",
    answer:
      "Often yes. Mixed systems can look sharp and solve practical needs (wider driveway openings, pool codes). We’ll design hardware and posts so the transition feels intentional.",
  },
] as const;

/** Legal / utility links shown in footer bottom bar. */
export const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
] as const;
