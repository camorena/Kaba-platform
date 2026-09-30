# Reuse port v28 — public chatbot via Vercel AI Gateway (GPT-4o mini)

**Date:** 2026-09-30 (America/Chicago)  
**Target:** [camorena/Kaba-platform](https://github.com/camorena/Kaba-platform) (`/workspace/kaba-fence`) — **kaba-platform only**  
**Prior:** `preview/REUSE_PORT_v27.md` (honest social footer links)  
**User-approved model:** `openai/gpt-4o-mini` (not gpt-5.4)

---

## What changed

- Added streaming `POST /api/chat` using the AI SDK (`ai`) + Vercel AI Gateway (`openai/gpt-4o-mini`).
- System prompt: Kaba Fence Angier/Raleigh NC, honest (no fake prices/promises), brand tone, push `/contact`, phone `(919) 292-4777`, email `kabafencellc@gmail.com`. Conversation history is sent in the request body.
- `ChatWidget` calls `/api/chat` with history; streams LLM text when Gateway auth works; falls back to the existing rules engine (`getBotReply`) when `AI_GATEWAY_API_KEY` / OIDC is missing or the API errors.
- Guardrails: light in-memory rate limit (~20 req/min/IP), `maxOutputTokens` ~450, **no tools** (nothing that invents quotes), secrets redacted from chat logs.
- Documented `AI_GATEWAY_API_KEY` in `.env.example`. **Do not invent or commit a key.** Prefer OIDC on Vercel.

## Env vars the user must add

| Var | Where | Required? |
| --- | --- | --- |
| `AI_GATEWAY_API_KEY` | Local `.env.local`; optional on Vercel | Local yes (or OIDC via `vercel env pull`); Vercel optional if OIDC works |
| *(OIDC)* `VERCEL_OIDC_TOKEN` | Auto on Vercel; local via `vercel env pull` | Preferred on Vercel production/preview |

**Do not** set a fabricated key on Vercel from this agent. User creates a key in the Vercel dashboard → AI Gateway → API Keys, then:

```bash
vercel env add AI_GATEWAY_API_KEY production --project kaba-platform
# optional preview:
vercel env add AI_GATEWAY_API_KEY preview --project kaba-platform
vercel --prod --yes --project kaba-platform
```

Or rely on OIDC alone after deploy (no static key).

## Enable on Vercel (kaba-platform)

1. Ensure the team has AI Gateway access / credits or billing enabled.
2. Prefer OIDC (automatic on Vercel). Optionally add `AI_GATEWAY_API_KEY`.
3. Redeploy **kaba-platform** only (do not resume paused `kaba-fence`).
4. Smoke-test the site chat widget; without credentials the rules engine still answers.

## Cost note

GPT-4o mini through AI Gateway is charged at OpenAI token rates with **no Gateway markup**. Public FAQ turns are short (`maxOutputTokens` capped). Set a spend budget in the AI Gateway dashboard.

## Verification

- `npx tsc --noEmit`
- `npm run lint` (optional)
- Without key: `POST /api/chat` returns JSON `mode: "rules"`.
- With key: `X-Kaba-Chat-Mode: llm` text stream.

## Files

- `src/app/api/chat/route.ts`
- `src/lib/chat/*` (gateway, system prompt, rate limit, messages, log)
- `src/components/ChatWidget.tsx`
- `.env.example`
