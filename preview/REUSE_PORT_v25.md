# Reuse port v25 — Retire old Vercel project (kaba-fence) via Option A

**Date:** 2026-09-29 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`)  
**Live (keep):** https://kaba-platform.vercel.app (`prj_4KoYIwmpM332ccXaUBH2HUpEg70z`)  
**Retired (paused):** https://kaba-fence.vercel.app (`prj_ajyT7nomaXhZr7oAwR57eVk4CV02`)  
**Team:** `carlos-s-projects-39e2de15`  
**Prior:** `preview/REUSE_PORT_v24.md`

---

## What was done (Option A — no delete)

1. **Disconnected Git** from Vercel project `kaba-fence` (was linked to `camorena/Kaba-platform`). Confirmed API `link: null`.
2. **Paused** `kaba-fence` via `POST /v1/projects/{id}/pause`. Confirmed API `paused: true`. Public URL returns **503 DEPLOYMENT_PAUSED**.
3. **Local `.vercel` link** already pointed at `kaba-platform` — no relink required.
4. **Verified** `kaba-platform` still production **READY** and https://kaba-platform.vercel.app returns **HTTP 200**. Git link to `camorena/Kaba-platform` (`main`) unchanged.

## Explicitly not done

- Project delete  
- Env / Stripe changes on `kaba-platform`  
- Touching `kabafence.com` / Squarespace / `kaba-web`

## Resume (if needed)

`vercel project resume kaba-fence --scope carlos-s-projects-39e2de15`  
or `POST /v1/projects/prj_ajyT7nomaXhZr7oAwR57eVk4CV02/unpause?teamId=…`
