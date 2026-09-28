/**
 * Light content-type registry (inspired by prior kaba-fence admin).
 *
 * One descriptor per editable entity drives list + edit stubs.
 * Route params select a KEY here — never a raw table name (allow-list).
 *
 * Phase A–C shipped as admin stubs. Public marketing still reads
 * `src/lib/site.ts` except cutovers via getPublished* (faqs, testimonials,
 * projects, fence-types, services, about, materials, service-area,
 * site-copy hero/trust/experience/needs/process, chatbot catalogs).
 */

export type FieldKind =
  | "text"
  | "textarea"
  | "select"
  | "number"
  | "checkbox";

export type CmsRegistryPhase = "A" | "B" | "C";

export type FieldSpec = {
  readonly name: string;
  readonly label: string;
  readonly labelEs: string;
  readonly kind: FieldKind;
  readonly required?: boolean;
  readonly hint?: string;
  readonly hintEs?: string;
  readonly options?: readonly {
    readonly value: string;
    readonly label: string;
    readonly labelEs: string;
  }[];
  readonly maxLength?: number;
  /** Locked on existing records (slug / key). */
  readonly locked?: boolean;
};

export type ContentTypeSpec = {
  readonly key: string;
  readonly singular: string;
  readonly singularEs: string;
  readonly plural: string;
  readonly pluralEs: string;
  readonly titleField: string;
  readonly fields: readonly FieldSpec[];
  readonly publishable: boolean;
  readonly orderBy: string;
  readonly phase: CmsRegistryPhase;
  /** Public route this type relates to (documentation / future). */
  readonly publicPath?: string;
  /** site.ts export this type mirrors today. */
  readonly siteSource: string;
};

const AUDIENCE_OPTIONS = [
  { value: "both", label: "Both", labelEs: "Ambos" },
  { value: "residential", label: "Residential", labelEs: "Residencial" },
  { value: "commercial", label: "Commercial", labelEs: "Comercial" },
] as const;

const CATEGORY_OPTIONS = [
  { value: "fence", label: "Fence", labelEs: "Cerca" },
  { value: "deck", label: "Deck", labelEs: "Terraza" },
] as const;

const ABOUT_KIND_OPTIONS = [
  { value: "local-trust", label: "Local trust", labelEs: "Confianza local" },
  { value: "stats", label: "Stat", labelEs: "Dato" },
  { value: "values", label: "Company value", labelEs: "Valor de la empresa" },
] as const;

const MATERIAL_KIND_OPTIONS = [
  { value: "fence", label: "Fence material", labelEs: "Material de cerca" },
  { value: "deck", label: "Deck material", labelEs: "Material de terraza" },
  { value: "guidance", label: "Guidance chip", labelEs: "Consejo" },
] as const;

const SITE_COPY_GROUP_OPTIONS = [
  { value: "hero", label: "Hero / site config", labelEs: "Héroe / config del sitio" },
  { value: "how-it-works", label: "How it works", labelEs: "Cómo funciona" },
  { value: "process", label: "Process timeline", labelEs: "Línea de proceso" },
  { value: "experience", label: "Kaba experience", labelEs: "Experiencia Kaba" },
  { value: "trust", label: "Trust points", labelEs: "Puntos de confianza" },
  { value: "needs", label: "Your needs (home)", labelEs: "Sus necesidades (inicio)" },
  { value: "nav", label: "Nav / footer labels", labelEs: "Etiquetas de nav / pie" },
] as const;

const PROVENANCE_OPTIONS = [
  { value: "kaba", label: "Kaba job / owned", labelEs: "Trabajo Kaba / propio" },
  { value: "stock", label: "Stock / licensed", labelEs: "Stock / con licencia" },
  { value: "other", label: "Other", labelEs: "Otro" },
] as const;

export const CONTENT_TYPES: Readonly<Record<string, ContentTypeSpec>> = {
  "fence-types": {
    key: "fence-types",
    singular: "Fence type",
    singularEs: "Tipo de cerca",
    plural: "Fence types",
    pluralEs: "Tipos de cerca",
    titleField: "name",
    publishable: true,
    orderBy: "sortOrder",
    phase: "A",
    publicPath: "/services",
    siteSource: "fencingServices",
    fields: [
      { name: "name", label: "Name", labelEs: "Nombre", kind: "text", required: true, maxLength: 120 },
      {
        name: "slug",
        label: "Slug",
        labelEs: "Slug",
        kind: "text",
        required: true,
        locked: true,
        hint: "Lowercase, hyphens. Matches /services#slug today.",
        hintEs: "Minúsculas y guiones. Coincide con /services#slug hoy.",
      },
      { name: "tagline", label: "Tagline", labelEs: "Eslogan", kind: "text", maxLength: 160 },
      { name: "summary", label: "Summary", labelEs: "Resumen", kind: "textarea", maxLength: 400 },
      { name: "details", label: "Details", labelEs: "Detalles", kind: "textarea", maxLength: 2000 },
      { name: "image", label: "Image path", labelEs: "Ruta de imagen", kind: "text", maxLength: 240 },
      {
        name: "audience",
        label: "Audience",
        labelEs: "Audiencia",
        kind: "select",
        options: AUDIENCE_OPTIONS,
      },
      { name: "sortOrder", label: "Order", labelEs: "Orden", kind: "number" },
    ],
  },
  services: {
    key: "services",
    singular: "Service",
    singularEs: "Servicio",
    plural: "Services",
    pluralEs: "Servicios",
    titleField: "name",
    publishable: true,
    orderBy: "sortOrder",
    phase: "A",
    publicPath: "/services",
    siteSource: "deckServices (+ fencing via fence-types)",
    fields: [
      { name: "name", label: "Name", labelEs: "Nombre", kind: "text", required: true, maxLength: 120 },
      {
        name: "slug",
        label: "Slug",
        labelEs: "Slug",
        kind: "text",
        required: true,
        locked: true,
      },
      { name: "summary", label: "Summary", labelEs: "Resumen", kind: "textarea", maxLength: 400 },
      { name: "details", label: "Details", labelEs: "Detalles", kind: "textarea", maxLength: 2000 },
      {
        name: "audience",
        label: "Audience",
        labelEs: "Audiencia",
        kind: "select",
        options: AUDIENCE_OPTIONS,
      },
      { name: "sortOrder", label: "Order", labelEs: "Orden", kind: "number" },
    ],
  },
  projects: {
    key: "projects",
    singular: "Project",
    singularEs: "Proyecto",
    plural: "Projects",
    pluralEs: "Proyectos",
    titleField: "title",
    publishable: true,
    orderBy: "sortOrder",
    phase: "A",
    publicPath: "/gallery",
    siteSource: "galleryProjects",
    fields: [
      { name: "title", label: "Title", labelEs: "Título", kind: "text", required: true, maxLength: 160 },
      { name: "slug", label: "Slug", labelEs: "Slug", kind: "text", required: true },
      {
        name: "category",
        label: "Category",
        labelEs: "Categoría",
        kind: "select",
        options: CATEGORY_OPTIONS,
      },
      { name: "caption", label: "Caption", labelEs: "Leyenda", kind: "text", maxLength: 240 },
      { name: "image", label: "Image path", labelEs: "Ruta de imagen", kind: "text", maxLength: 240 },
      {
        name: "beforeImage",
        label: "Before image path",
        labelEs: "Ruta imagen antes",
        kind: "text",
        maxLength: 240,
        hint: "Optional. Drop file under public/gallery/before/.",
        hintEs: "Opcional. Coloque el archivo en public/gallery/before/.",
      },
      {
        name: "beforeCaption",
        label: "Before caption",
        labelEs: "Leyenda antes",
        kind: "text",
        maxLength: 240,
      },
      { name: "city", label: "City", labelEs: "Ciudad", kind: "text", maxLength: 80 },
      { name: "isFeatured", label: "Feature on homepage", labelEs: "Destacar en inicio", kind: "checkbox" },
      { name: "sortOrder", label: "Order", labelEs: "Orden", kind: "number" },
    ],
  },
  faqs: {
    key: "faqs",
    singular: "FAQ",
    singularEs: "Pregunta frecuente",
    plural: "FAQs",
    pluralEs: "Preguntas frecuentes",
    titleField: "question",
    publishable: true,
    orderBy: "sortOrder",
    phase: "A",
    publicPath: "/faq",
    siteSource: "faqs",
    fields: [
      { name: "question", label: "Question", labelEs: "Pregunta", kind: "text", required: true, maxLength: 300 },
      {
        name: "answer",
        label: "Answer",
        labelEs: "Respuesta",
        kind: "textarea",
        required: true,
        maxLength: 2000,
        hint: "Never put a price here.",
        hintEs: "Nunca incluya un precio aquí.",
      },
      { name: "category", label: "Category", labelEs: "Categoría", kind: "text", maxLength: 60 },
      { name: "sortOrder", label: "Order", labelEs: "Orden", kind: "number" },
    ],
  },
  "site-copy": {
    key: "site-copy",
    singular: "Site copy",
    singularEs: "Texto del sitio",
    plural: "Site copy & CTAs",
    pluralEs: "Textos y CTAs del sitio",
    titleField: "key",
    publishable: true,
    orderBy: "sortOrder",
    phase: "B",
    publicPath: "/",
    siteSource: "siteConfig hero/tagline, howItWorks, processTimeline, kabaExperience, trustPoints, yourNeeds",
    fields: [
      {
        name: "key",
        label: "Key",
        labelEs: "Clave",
        kind: "text",
        required: true,
        locked: true,
        maxLength: 120,
        hint: "Stable key (e.g. hero.headline). Prefer keys over free-form HTML.",
        hintEs: "Clave estable (p. ej. hero.headline). Prefiera claves, no HTML libre.",
      },
      {
        name: "group",
        label: "Group",
        labelEs: "Grupo",
        kind: "select",
        options: SITE_COPY_GROUP_OPTIONS,
      },
      { name: "label", label: "Label", labelEs: "Etiqueta", kind: "text", maxLength: 120 },
      {
        name: "value",
        label: "Value",
        labelEs: "Valor",
        kind: "textarea",
        required: true,
        maxLength: 2000,
      },
      { name: "sortOrder", label: "Order", labelEs: "Orden", kind: "number" },
    ],
  },
  about: {
    key: "about",
    singular: "About block",
    singularEs: "Bloque Nosotros",
    plural: "About page",
    pluralEs: "Página Nosotros",
    titleField: "title",
    publishable: true,
    orderBy: "sortOrder",
    phase: "B",
    publicPath: "/about",
    siteSource: "aboutLocalTrust, aboutStats, companyValues",
    fields: [
      {
        name: "kind",
        label: "Kind",
        labelEs: "Tipo",
        kind: "select",
        options: ABOUT_KIND_OPTIONS,
      },
      { name: "title", label: "Title / value", labelEs: "Título / valor", kind: "text", required: true, maxLength: 120 },
      {
        name: "description",
        label: "Description / label",
        labelEs: "Descripción / etiqueta",
        kind: "textarea",
        maxLength: 800,
      },
      { name: "sortOrder", label: "Order", labelEs: "Orden", kind: "number" },
    ],
  },
  testimonials: {
    key: "testimonials",
    singular: "Testimonial",
    singularEs: "Testimonio",
    plural: "Reviews / testimonials",
    pluralEs: "Reseñas / testimonios",
    titleField: "name",
    publishable: true,
    orderBy: "sortOrder",
    phase: "B",
    publicPath: "/reviews",
    siteSource: "testimonials",
    fields: [
      {
        name: "quote",
        label: "Quote",
        labelEs: "Cita",
        kind: "textarea",
        required: true,
        maxLength: 800,
      },
      { name: "name", label: "Name", labelEs: "Nombre", kind: "text", required: true, maxLength: 80 },
      { name: "town", label: "Town", labelEs: "Ciudad", kind: "text", required: true, maxLength: 80 },
      {
        name: "sortOrder",
        label: "Order",
        labelEs: "Orden",
        kind: "number",
        hint: "No fake star ratings without proof.",
        hintEs: "Sin calificaciones con estrellas inventadas.",
      },
    ],
  },
  "service-area": {
    key: "service-area",
    singular: "Service town",
    singularEs: "Ciudad de servicio",
    plural: "Service area towns",
    pluralEs: "Ciudades de servicio",
    titleField: "name",
    publishable: true,
    orderBy: "sortOrder",
    phase: "B",
    publicPath: "/service-area",
    siteSource: "serviceTowns, siteConfig.serviceArea",
    fields: [
      { name: "name", label: "Town", labelEs: "Ciudad", kind: "text", required: true, maxLength: 80 },
      { name: "region", label: "Region / county", labelEs: "Región / condado", kind: "text", maxLength: 80 },
      {
        name: "note",
        label: "Note",
        labelEs: "Nota",
        kind: "textarea",
        maxLength: 400,
        hint: "Geographic claim — keep honest vs real service footprint.",
        hintEs: "Afirmación geográfica: manténgala honesta frente a la cobertura real.",
      },
      { name: "sortOrder", label: "Order", labelEs: "Orden", kind: "number" },
    ],
  },
  materials: {
    key: "materials",
    singular: "Material",
    singularEs: "Material",
    plural: "Materials guide",
    pluralEs: "Guía de materiales",
    titleField: "name",
    publishable: true,
    orderBy: "sortOrder",
    phase: "B",
    publicPath: "/materials",
    siteSource: "fenceMaterials, materialGuidance, deckMaterials",
    fields: [
      {
        name: "kind",
        label: "Kind",
        labelEs: "Tipo",
        kind: "select",
        options: MATERIAL_KIND_OPTIONS,
      },
      { name: "name", label: "Name / title", labelEs: "Nombre / título", kind: "text", required: true, maxLength: 120 },
      { name: "slug", label: "Slug / id", labelEs: "Slug / id", kind: "text", maxLength: 80 },
      { name: "tagline", label: "Tagline", labelEs: "Eslogan", kind: "text", maxLength: 160 },
      { name: "bestFor", label: "Best for", labelEs: "Ideal para", kind: "text", maxLength: 240 },
      { name: "lifespan", label: "Lifespan", labelEs: "Vida útil", kind: "text", maxLength: 80 },
      { name: "maintenance", label: "Maintenance", labelEs: "Mantenimiento", kind: "text", maxLength: 160 },
      { name: "privacy", label: "Privacy", labelEs: "Privacidad", kind: "text", maxLength: 60 },
      { name: "upkeep", label: "Upkeep", labelEs: "Cuidado", kind: "text", maxLength: 60 },
      {
        name: "costTier",
        label: "Cost tier (symbols only)",
        labelEs: "Nivel de costo (solo símbolos)",
        kind: "text",
        maxLength: 8,
        hint: "Use $ / $$ / $$$ — never dollar amounts.",
        hintEs: "Use $ / $$ / $$$ — nunca montos en dólares.",
      },
      { name: "image", label: "Image path", labelEs: "Ruta de imagen", kind: "text", maxLength: 240 },
      { name: "servicesHref", label: "Services href", labelEs: "Enlace a servicios", kind: "text", maxLength: 120 },
      {
        name: "pros",
        label: "Pros (one per line)",
        labelEs: "Ventajas (una por línea)",
        kind: "textarea",
        maxLength: 800,
      },
      {
        name: "cons",
        label: "Cons (one per line)",
        labelEs: "Desventajas (una por línea)",
        kind: "textarea",
        maxLength: 800,
      },
      {
        name: "tip",
        label: "Tip / body",
        labelEs: "Consejo / cuerpo",
        kind: "textarea",
        maxLength: 800,
      },
      { name: "sortOrder", label: "Order", labelEs: "Orden", kind: "number" },
    ],
  },
  media: {
    key: "media",
    singular: "Media asset",
    singularEs: "Recurso multimedia",
    plural: "Media library",
    pluralEs: "Biblioteca de medios",
    titleField: "alt",
    publishable: true,
    orderBy: "sortOrder",
    phase: "C",
    publicPath: "/gallery",
    siteSource: "public/gallery/* paths",
    fields: [
      {
        name: "path",
        label: "Path",
        labelEs: "Ruta",
        kind: "text",
        required: true,
        maxLength: 240,
        hint: "Local public path, e.g. /gallery/cedar-privacy.jpg. Drop files in public/gallery/ — no paid storage required.",
        hintEs: "Ruta local pública, p. ej. /gallery/cedar-privacy.jpg. Coloque archivos en public/gallery/ — no se requiere almacenamiento de pago.",
      },
      {
        name: "alt",
        label: "Alt text",
        labelEs: "Texto alternativo",
        kind: "text",
        required: true,
        maxLength: 240,
        hint: "Required before publish. Describe the image for accessibility.",
        hintEs: "Obligatorio antes de publicar. Describa la imagen para accesibilidad.",
      },
      {
        name: "provenance",
        label: "Provenance",
        labelEs: "Procedencia",
        kind: "select",
        options: PROVENANCE_OPTIONS,
      },
      { name: "width", label: "Width (px)", labelEs: "Ancho (px)", kind: "number" },
      { name: "height", label: "Height (px)", labelEs: "Alto (px)", kind: "number" },
      {
        name: "notes",
        label: "Notes",
        labelEs: "Notas",
        kind: "textarea",
        maxLength: 400,
        hint: "Upload stub: binary upload / EXIF strip comes later. Until then, use public/ folder.",
        hintEs: "Carga binaria / EXIF más adelante. Mientras tanto, use la carpeta public/.",
      },
      { name: "sortOrder", label: "Order", labelEs: "Orden", kind: "number" },
    ],
  },
};

export type ContentTypeKey = keyof typeof CONTENT_TYPES;

export function resolveContentType(key: string): ContentTypeSpec | null {
  return CONTENT_TYPES[key] ?? null;
}

export function listContentTypes(): ContentTypeSpec[] {
  return Object.values(CONTENT_TYPES);
}

export function listContentTypesByPhase(phase: CmsRegistryPhase): ContentTypeSpec[] {
  return listContentTypes().filter((t) => t.phase === phase);
}
