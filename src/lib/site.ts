export const siteConfig = {
  name: "Kaba Fence",
  tagline: "Fence & Deck Repair and Installation",
  description:
    "Kaba Fence builds and repairs fences and decks for homeowners in Angier, Raleigh, and surrounding North Carolina communities.",
  serviceArea:
    "Angier, Raleigh, Fuquay-Varina, Clayton, Holly Springs, and surrounding communities",
  phone: "(919) 555-0147",
  phoneHref: "tel:+19195550147",
  email: "hello@kabafence.com",
  emailHref: "mailto:hello@kabafence.com",
  hours: {
    weekdays: "Monday – Friday: 8:00 AM – 5:00 PM",
    saturday: "Saturday: By appointment",
    sunday: "Sunday: Closed",
  },
  address: {
    city: "Angier",
    state: "NC",
    zip: "27501",
    region: "Serving Angier, Raleigh & surrounding communities",
  },
} as const;

/** Primary header + footer nav (kept lean for mobile). */
export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
  { href: "/quote", label: "Quote" },
] as const;

/** Secondary links — footer (+ optional secondary surfaces). */
export const footerLinks = [
  { href: "/service-area", label: "Service area" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
] as const;

export const fencingServices = [
  {
    slug: "wood",
    title: "Wood Fencing",
    summary:
      "Classic privacy and picket fences built with quality lumber for lasting curb appeal.",
    details:
      "From cedar privacy panels to traditional picket styles, we install and repair wood fences that stand up to Carolina weather and look great for years.",
  },
  {
    slug: "vinyl",
    title: "Vinyl Fencing",
    summary:
      "Low-maintenance vinyl that keeps its color and never needs staining or painting.",
    details:
      "Ideal for busy homeowners who want privacy and style without the upkeep. Available in white, tan, and other popular finishes.",
  },
  {
    slug: "chain-link",
    title: "Chain-Link Fencing",
    summary:
      "Durable, affordable security fencing for yards, pets, and commercial lots.",
    details:
      "Galvanized and vinyl-coated options. Great for pet containment, sports courts, and secure perimeters.",
  },
  {
    slug: "aluminum",
    title: "Aluminum & Ornamental",
    summary:
      "Elegant, rust-resistant aluminum that adds security without blocking the view.",
    details:
      "Ornamental aluminum and iron-look styles that elevate your property while keeping kids and pets safely inside.",
  },
  {
    slug: "privacy",
    title: "Privacy Fencing",
    summary:
      "Solid panels that create a private outdoor space for your family.",
    details:
      "Wood, vinyl, or composite privacy systems sized and styled for Angier and Raleigh-area homes.",
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

export const galleryProjects = [
  {
    id: "cedar-privacy",
    title: "Cedar Privacy Fence — Raleigh",
    category: "fence" as const,
    image: "/gallery/cedar-privacy.png",
    caption: "Cedar privacy fence — Raleigh",
  },
  {
    id: "vinyl-privacy",
    title: "White Vinyl Privacy — Angier",
    category: "fence" as const,
    image: "/gallery/vinyl-privacy.png",
    caption: "White vinyl privacy — Angier",
  },
  {
    id: "aluminum-ornamental",
    title: "Aluminum Ornamental — Wake County",
    category: "fence" as const,
    image: "/gallery/aluminum-ornamental.png",
    caption: "Aluminum ornamental — Wake County",
  },
  {
    id: "chain-link",
    title: "Chain-Link Enclosure — Raleigh Area",
    category: "fence" as const,
    image: "/gallery/chain-link.png",
    caption: "Chain-link enclosure — Raleigh area",
  },
  {
    id: "deck-new-build",
    title: "New Elevated Deck — Angier",
    category: "deck" as const,
    image: "/gallery/deck-new-build.png",
    caption: "New elevated deck — Angier",
  },
  {
    id: "deck-repair",
    title: "Deck Repair & Railing Refresh — Raleigh",
    category: "deck" as const,
    image: "/gallery/deck-repair.png",
    caption: "Deck repair & railing refresh — Raleigh",
  },
] as const;

/** Compact 3-step summary used on home + services. */
export const howItWorks = [
  {
    step: "1",
    title: "Request a Quote",
    description:
      "Tell us about your fence or deck project online or by phone. We serve Angier, Raleigh, and nearby towns.",
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

/** Full process timeline for /how-it-works. */
export const processTimeline = [
  {
    step: "01",
    title: "Estimate",
    eyebrow: "Free on-site visit",
    description:
      "Share your goals online or by phone. We schedule a free visit, measure carefully, and deliver a clear written estimate with material options that fit Angier and Raleigh homes.",
  },
  {
    step: "02",
    title: "Design",
    eyebrow: "Materials & layout",
    description:
      "Together we lock in style, height, gates, and finishes—wood, vinyl, chain-link, aluminum, or deck systems—plus any HOA or permit considerations for your neighborhood.",
  },
  {
    step: "03",
    title: "Build",
    eyebrow: "Crafted on schedule",
    description:
      "Our local crew installs or repairs on the agreed timeline. We protect landscaping, set posts and framing properly, and keep the job site organized every day.",
  },
  {
    step: "04",
    title: "Walkthrough",
    eyebrow: "Clean finish",
    description:
      "We walk the finished fence or deck with you, adjust gates and hardware, haul debris, and make sure everything feels solid before we leave.",
  },
] as const;

export const trustPoints = [
  { label: "Local to Angier & Raleigh" },
  { label: "Free On-Site Estimates" },
  { label: "Quality Materials" },
  { label: "Clean Job Sites" },
] as const;

export const companyValues = [
  {
    title: "Local & accountable",
    description:
      "We’re based in Angier and work across the Raleigh area. When you call, you’re talking to the crew that shows up—not a national call center.",
  },
  {
    title: "Clear estimates",
    description:
      "Written quotes with materials, scope, and timeline spelled out. No vague ranges, no surprise line items after the posts are set.",
  },
  {
    title: "Built for Carolina weather",
    description:
      "We specify lumber, fasteners, and finishes that hold up to heat, humidity, and storms—so your fence or deck lasts.",
  },
  {
    title: "Job sites left clean",
    description:
      "Cut-offs hauled, lawn protected, gates swinging true. Neighbors should notice the new fence—not the mess.",
  },
] as const;

export const serviceTowns = [
  {
    name: "Angier",
    region: "Harnett County",
    note: "Home base — fence installs, deck rebuilds, and repairs across town and nearby rural lots.",
  },
  {
    name: "Raleigh",
    region: "Wake County",
    note: "Privacy fences, ornamental aluminum, and deck projects for in-town and suburban homes.",
  },
  {
    name: "Fuquay-Varina",
    region: "Wake County",
    note: "New builds and replacements for growing neighborhoods and larger backyard lots.",
  },
  {
    name: "Holly Springs",
    region: "Wake County",
    note: "HOA-friendly vinyl and wood privacy systems, plus deck rail and stair upgrades.",
  },
  {
    name: "Clayton",
    region: "Johnston County",
    note: "Chain-link, wood privacy, and deck repair for homes east of Raleigh.",
  },
  {
    name: "Garner",
    region: "Wake County",
    note: "Fence replacements and deck refreshes for established neighborhoods.",
  },
  {
    name: "Cary",
    region: "Wake County",
    note: "Select ornamental and privacy projects where schedule and access allow.",
  },
  {
    name: "Apex",
    region: "Wake County",
    note: "Wood and vinyl fencing with clean installs for suburban yards.",
  },
  {
    name: "Dunn",
    region: "Harnett County",
    note: "Rural and in-town fence lines, pet enclosures, and deck repairs.",
  },
  {
    name: "Lillington",
    region: "Harnett County",
    note: "Fence and deck work for Harnett County homeowners south of Angier.",
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
] as const;

export const testimonials = [
  {
    quote:
      "Kaba Fence replaced our tired backyard fence in two days and left the yard spotless. The new cedar looks fantastic.",
    name: "Megan R.",
    town: "Fuquay-Varina",
  },
  {
    quote:
      "They repaired our deck stairs and railing quickly, explained every step, and made the whole process easy.",
    name: "Chris & Dana P.",
    town: "Holly Springs",
  },
  {
    quote:
      "From the first estimate to the final gate adjustment, the crew was on time, thoughtful, and dependable.",
    name: "Laura T.",
    town: "Clayton",
  },
  {
    quote:
      "We needed vinyl privacy that would pass HOA review. Kaba walked us through options, got it approved, and installed it cleanly.",
    name: "Jordan M.",
    town: "Cary",
  },
  {
    quote:
      "Storm damage took out a section of our fence. They matched the existing panels and had us secure again within the week.",
    name: "Pat & Elena S.",
    town: "Angier",
  },
  {
    quote:
      "Our new elevated deck feels solid and the railings look sharp. Clear quote, steady communication, no drama.",
    name: "Marcus W.",
    town: "Raleigh",
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
      "We help you understand local permit and HOA requirements for Angier, Raleigh, and nearby towns. When a permit is needed, we'll guide the paperwork and build to the approved plan.",
  },
  {
    question: "What materials hold up best in North Carolina weather?",
    answer:
      "Cedar and pressure-treated wood, vinyl, and powder-coated aluminum all perform well here. The right choice depends on privacy goals, budget, and how much maintenance you want. We'll walk you through options on site.",
  },
  {
    question: "Can you repair an existing deck instead of replacing it?",
    answer:
      "Often yes. We inspect framing, joists, boards, and railings first. If the structure is sound, targeted repairs and railing upgrades can restore safety and look without a full rebuild.",
  },
  {
    question: "What towns do you serve?",
    answer:
      "We’re based in Angier and regularly work in Raleigh, Fuquay-Varina, Holly Springs, Clayton, Garner, Cary, Apex, Dunn, Lillington, Knightdale, Wake Forest, and nearby communities. If you’re close and unsure, call—we’ll let you know.",
  },
  {
    question: "Is the estimate really free?",
    answer:
      "Yes. On-site estimates for residential fence and deck projects are free and no-obligation. You’ll leave with a written scope and price so you can decide on your timeline.",
  },
  {
    question: "How do I prepare for install day?",
    answer:
      "Clear access along the fence or deck line when you can, note underground utilities we’ve already marked through 811, and let us know about pets or locked gates. We’ll confirm details before we arrive.",
  },
  {
    question: "Do you build gates and hardware upgrades?",
    answer:
      "Absolutely. New gates, latch and hinge upgrades, and walk-through or driveway openings are part of many fence projects—and we can add them to an existing fence when it makes sense.",
  },
] as const;
