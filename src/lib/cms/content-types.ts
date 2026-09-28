/**
 * Light content-type registry (inspired by prior kaba-fence admin).
 *
 * One descriptor per editable entity drives list + edit stubs.
 * Route params select a KEY here — never a raw table name (allow-list).
 *
 * Public marketing still reads `src/lib/site.ts` until the documented swap path.
 */

export type FieldKind =
  | "text"
  | "textarea"
  | "select"
  | "number"
  | "checkbox";

export type FieldSpec = {
  readonly name: string;
  readonly label: string;
  readonly labelEs: string;
  readonly kind: FieldKind;
  readonly required?: boolean;
  readonly hint?: string;
  readonly hintEs?: string;
  readonly options?: readonly { readonly value: string; readonly label: string; readonly labelEs: string }[];
  readonly maxLength?: number;
  /** Locked on existing records (slug). */
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
};

export type ContentTypeKey = keyof typeof CONTENT_TYPES;

export function resolveContentType(key: string): ContentTypeSpec | null {
  return CONTENT_TYPES[key] ?? null;
}

export function listContentTypes(): ContentTypeSpec[] {
  return Object.values(CONTENT_TYPES);
}
