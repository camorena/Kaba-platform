# Reuse port v4 — credentials auth + trust claims server save

**Date:** 2026-09-28 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Prior:** `preview/REUSE_PORT_v3.md` (Postgres adapter + Angier/Raleigh seed)

---

## Shipped this pass

1. **Dual-mode auth** — `src/lib/admin/auth.ts` + fleshed `dal.ts`  
   | Mode | When | Sign-in | Session | Role |
   |------|------|---------|---------|------|
   | **stub** (default) | `AUTH_SECRET` unset | `ADMIN_PASSWORD` | cookie `stub-ok` | synthetic `owner` (`stub: true`) |
   | **credentials** | `AUTH_SECRET` set | email + password vs `profiles` | HMAC-signed `cred.v1…` | `profiles.role` re-loaded every request (`stub: false`) |

   Free path — Node `scrypt` hashes, no Clerk, no Auth.js package required. Auth.js can wrap later for OAuth; keep `getCurrentAdmin()` as the resolver.

2. **Profiles repo** — memory + Postgres  
   Migration `db/migrations/0002_profiles_credentials.sql` (`password_hash`, unique email).  
   Seed `db/seeds/0002_owner_profile.sql` — demo owner.

3. **Trust claims server save** — `GET`/`PUT /api/admin/trust-claims`  
   Settings UI prefers the API (adapter memory or Postgres `site_settings`); localStorage is fallback only.  
   `getTrustClaimsForPublic()` already reads the adapter.

4. **Settings → Security** reflects **live mode** (badge, session role, enable docs). EN + Formal Colombian Spanish.

5. **Build stays DB-free** — default stub + memory adapter; no `AUTH_SECRET` / `DATABASE_URL` required for `npm run build`.

---

## How to enable credentials mode

```bash
# 1. Secret (required to flip mode)
# openssl rand -base64 32
# → add to .env.local:
# AUTH_SECRET=<that value>

# 2a. Memory adapter (default) — demo owner is in-process
#     email:    owner@kabafence.example
#     password: change-me-owner

# 2b. Postgres — migrate + seed (includes owner profile)
docker compose up -d   # optional
export DATABASE_URL=postgres://kaba:kaba@127.0.0.1:5432/kaba_fence
npm run db:migrate     # 0001 + 0002
npm run db:seed        # Angier demo + owner profile
# KABA_DATA_ADAPTER=postgres
# DATABASE_URL=…

# 3. Restart next, open /admin/login — email + password form
```

Remove `AUTH_SECRET` (or leave it unset) to fall back to the **ADMIN_PASSWORD** stub.

### Demo owner

| Field    | Value |
|----------|-------|
| email    | `owner@kabafence.example` |
| password | `change-me-owner` |
| role     | `owner` |

Rotate before any shared or production use.

---

## Trust claims API

| Method | Path | Role | Effect |
|--------|------|------|--------|
| GET | `/api/admin/trust-claims` | viewer+ | Read from adapter |
| PUT | `/api/admin/trust-claims` | editor+ | Save `{ claimFreeEstimates, claimLocallyOwned }` |

Public reader (server): `getTrustClaimsForPublic()` → adapter. Marketing badges still use `site.ts` until wired.

---

## Explicitly next

| Item | Why later |
|------|-----------|
| **Stripe webhooks** | Checkout / Payment Intents / webhooks |
| **Auth.js OAuth** | Optional; credentials path already uses profiles.role |
| **Wire public trust bar** | Point marketing badges at `getTrustClaimsForPublic()` |
| **Notify mail** | Wire `notifyQuoteCreated`; drain `notified_at IS NULL` |
| **MFA / rate limits** | Before public internet exposure |

---

## Non-goals (this pass)

- Paid Clerk requirement  
- Required live DB for `npm run build`  
- Stripe keys live  
- Fake multi-user accounts beyond the seeded demo owner  

See also: `preview/REUSE_PORT_v1.md` … `v3.md`, `preview/PRIOR_KABA_FENCE_REPO_REVIEW.md`.
