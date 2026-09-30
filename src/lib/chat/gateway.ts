/**
 * Vercel AI Gateway configuration helpers.
 *
 * Auth (prefer OIDC on Vercel; API key for local):
 * - Local / non-Vercel: set AI_GATEWAY_API_KEY
 * - Vercel production/preview: OIDC is automatic (no static key required)
 * - Optional on Vercel: AI_GATEWAY_API_KEY still works and takes precedence
 *
 * Model: openai/gpt-4o-mini (user-approved).
 */

export const CHAT_MODEL_ID = "openai/gpt-4o-mini" as const;

/** Soft cap on model output — public FAQ answers stay short. */
export const CHAT_MAX_OUTPUT_TOKENS = 450;

/** Keep request payloads bounded. */
export const CHAT_MAX_HISTORY_MESSAGES = 24;
export const CHAT_MAX_MESSAGE_CHARS = 2000;

/**
 * True when the AI Gateway can authenticate this process.
 * Missing credentials → public chat falls back to the rules engine.
 */
export function isAiGatewayConfigured(): boolean {
  if (process.env.AI_GATEWAY_API_KEY?.trim()) return true;
  // Prefer OIDC on Vercel deployments (token may be env or request header).
  if (process.env.VERCEL === "1") return true;
  if (process.env.VERCEL_OIDC_TOKEN?.trim()) return true;
  return false;
}
