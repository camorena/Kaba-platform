# Reuse port v17 — launch polish + Postgres + credentials flip

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** admin17 Content / admin18 Settings minimal craft; `preview/REUSE_PORT_v16.md`

---

## Track 1 — Launch polish (admin19)

Same quiet craft as Content/Settings applied to:

| Surface | Changes |
|---------|---------|
| Dashboard | Soft jump links, flat glass (no gold rails), quiet chips, muted attention lists |
| Quotes list | Soft status filters, quiet “gone quiet”, table without gold rail |
| Quote detail | Flat progress panel; muted next-step footnote |
| Invoices list | i18n create card + soft filters; quiet Demo chip |
| Invoice detail | Flat progress; quiet Demo chip; muted balance note |
| Pipeline | Softer columns/cards; adapter-aware footer |

Features, EN + Formal Colombian Spanish, dark/light, responsive retained.  
Screenshots: `preview/admin19-*.png`  
Optional review: `preview/ADMIN_LAUNCH_MINIMAL_REVIEW.md`

---

## Track 2 — Postgres production wiring

**Default remains memory** — `npm run build` needs no `DATABASE_URL`.

| Piece | Status |
|-------|--------|
| `npm run db:migrate` | `scripts/db-migrate.mjs` — schema_migrations, clear errors, SSL-friendly URL |
| `npm run db:seed` | `scripts/db-seed.mjs` — requires migrate; seeds demo + owner profile |
| `docker-compose.yml` | Local Postgres 17 (`kaba`/`kaba`/`kaba_fence` on `:5432`) |
| Settings → Platform | Production checklist (Vercel) — you supply `DATABASE_URL` |

### Enable Postgres (local)

```bash
docker compose up -d   # or: docker-compose up -d
DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence npm run db:migrate
DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence npm run db:seed
# .env.local:
KABA_DATA_ADAPTER=postgres
DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence
```

### Enable Postgres (Vercel)

1. Provision Postgres yourself (Neon / Supabase / RDS / …) — **do not invent a URL**.
2. Vercel project env:
   - `DATABASE_URL` = provider connection string (often `?sslmode=require`)
   - `KABA_DATA_ADAPTER=postgres`
3. Run migrate + seed **once** against that URL (laptop or CI).
4. Redeploy.

Unset `KABA_DATA_ADAPTER` (or set `memory`) to stay on the build-safe default.

---

## Track 3 — Credentials auth harden

| Mode | When | Login |
|------|------|--------|
| **stub** (default) | `AUTH_SECRET` unset | Shared `ADMIN_PASSWORD` cookie |
| **credentials** | `AUTH_SECRET` set | Email/password vs `profiles.role` |

Stub remains the fallback when `AUTH_SECRET` is absent. Login UI quieter; credentials path shows email + password labels/placeholder. Settings → Security documents **change the demo owner password**.

### Flip to credentials

```bash
# Generate secret
openssl rand -base64 32

# .env.local or Vercel:
AUTH_SECRET=<that value>

# Demo owner (memory always; Postgres after seed 0002):
#   email:    owner@kabafence.example
#   password: change-me-owner
```

Rotate `password_hash` (Node scrypt via `src/lib/admin/password.ts` `hashPassword`) or insert your own owner before production. Removing `AUTH_SECRET` restores the stub.

Profiles seed: `db/seeds/0002_owner_profile.sql` (idempotent delete+insert). Memory: `src/lib/db/memory/profiles.ts`.

---

## How to demo polish

```bash
npm run build && npm run start -- -p 3019
node scripts/admin19-launch-shots.mjs
```

---

## Non-goals

- Provisioning a cloud database for the user  
- MFA / rate limits / full Auth.js OAuth (roadmap only)  
- Changing default adapter away from memory  

See also: `preview/REUSE_PORT_v1.md` … `v16.md`, `.env.example`, Settings → Security / Platform.
