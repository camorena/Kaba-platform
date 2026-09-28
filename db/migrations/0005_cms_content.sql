-- Optional CMS content tables (scaffold).
-- Public site still reads src/lib/site.ts until the documented swap path.
-- Default runtime: memory store in src/lib/cms/memory-store.ts.
--
-- Apply with: DATABASE_URL=… npm run db:migrate
-- No seed SQL yet — memory seeds from site.ts mirrors.

create type content_status as enum ('draft', 'published');

create table if not exists cms_documents (
  id            text primary key,
  type          text not null,
  status        content_status not null default 'draft',
  sort_order    integer not null default 0,
  fields        jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  constraint cms_documents_type_check check (
    type in ('fence-types', 'services', 'projects', 'faqs')
  )
);

create index if not exists cms_documents_type_sort_idx
  on cms_documents (type, sort_order);

comment on table cms_documents is
  'CMS scaffold — admin list/edit stubs. Public marketing still uses site.ts until swap.';
