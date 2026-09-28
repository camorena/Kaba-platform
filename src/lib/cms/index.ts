export {
  CONTENT_TYPES,
  listContentTypes,
  listContentTypesByPhase,
  resolveContentType,
  type ContentTypeKey,
  type ContentTypeSpec,
  type FieldSpec,
  type FieldKind,
  type CmsRegistryPhase,
} from "@/lib/cms/content-types";
export type {
  ContentDocument,
  ContentFieldValue,
  PublishedAudience,
  PublishedFaq,
  PublishedFenceType,
  PublishedTestimonial,
  PublishedProject,
  PublishedService,
} from "@/lib/cms/types";
export {
  listContent,
  getContent,
  updateContent,
  contentCounts,
} from "@/lib/cms/memory-store";

export {
  CMS_PUBLIC_ROADMAP,
  shippedContentKeys,
  upcomingContentTypes,
  cutoverContentTypes,
  type CmsPhase,
  type PlannedContentType,
} from "@/lib/cms/roadmap";

export {
  getPublishedFaqs,
  faqsSourceIsCms,
  getPublishedTestimonials,
  testimonialsSourceIsCms,
  getPublishedProjects,
  projectsSourceIsCms,
  getPublishedFenceTypes,
  fenceTypesSourceIsCms,
  getPublishedServices,
  servicesSourceIsCms,
} from "@/lib/cms/public";
