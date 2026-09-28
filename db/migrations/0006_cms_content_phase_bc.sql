-- Expand cms_documents allow-list for Phase B + C content types.
-- Runtime still defaults to memory store; this keeps optional Postgres ready.
--
-- Apply with: DATABASE_URL=… npm run db:migrate

alter table cms_documents drop constraint if exists cms_documents_type_check;

alter table cms_documents add constraint cms_documents_type_check check (
  type in (
    'fence-types',
    'services',
    'projects',
    'faqs',
    'site-copy',
    'about',
    'testimonials',
    'service-area',
    'materials',
    'media'
  )
);

comment on table cms_documents is
  'CMS scaffold Phase A–C. Public /faq may read published faqs; other marketing still uses site.ts until swap.';
