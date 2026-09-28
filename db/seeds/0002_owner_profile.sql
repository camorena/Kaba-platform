-- Demo owner profile for credentials mode (AUTH_SECRET set).
-- Email: owner@kabafence.example
-- Password: change-me-owner
-- Safe to re-run.
-- © 2026 Datelica LLC — Kaba Fence.

delete from profiles
where id = 'c3000001-0001-4000-8000-000000000001'
   or lower(email) = lower('owner@kabafence.example');

insert into profiles (
  id, email, full_name, role, is_active, password_hash, created_at, updated_at
) values (
  'c3000001-0001-4000-8000-000000000001',
  'owner@kabafence.example',
  'Ops Lead',
  'owner',
  true,
  'scrypt$n=16384$r=8$p=1$XdfdfwyViUvItHBd-XT0QA$qhM_xvZWCjGqFl3AOZbV63_o7Kw3RP83qUNtk8C8--Q',
  now(),
  now()
);

select 'profiles'::text as entity, count(*)::int as n from profiles;
