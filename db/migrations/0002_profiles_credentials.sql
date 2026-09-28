-- Profiles credentials support — password_hash + unique email for Auth.js-shaped login.
-- Applied by: DATABASE_URL=… npm run db:migrate
-- Default runtime auth remains ADMIN_PASSWORD stub until AUTH_SECRET is set.
-- © 2026 Datelica LLC — Kaba Fence.

alter table profiles
  add column if not exists password_hash text not null default '';

comment on column profiles.password_hash is
  'scrypt encoding for credentials mode (see src/lib/admin/password.ts). Empty = cannot sign in via credentials.';

create unique index if not exists profiles_email_lower_uidx
  on profiles (lower(email));
