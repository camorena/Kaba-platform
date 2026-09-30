/**
 * Chat logging helpers — never echo secrets or raw authorization material.
 */

const SECRET_PATTERN =
  /(AI_GATEWAY_API_KEY|VERCEL_OIDC_TOKEN|Authorization|Bearer\s+[A-Za-z0-9._\-]+|sk-[A-Za-z0-9]+|vcst_[A-Za-z0-9]+)/gi;

export function redactSecrets(value: string): string {
  return value.replace(SECRET_PATTERN, "[redacted]");
}

export function chatLog(
  level: "info" | "warn" | "error",
  message: string,
  detail?: Record<string, unknown>,
): void {
  const safeMessage = redactSecrets(message);
  const safeDetail = detail
    ? JSON.parse(redactSecrets(JSON.stringify(detail)))
    : undefined;
  const line = safeDetail
    ? `[chat] ${safeMessage} ${JSON.stringify(safeDetail)}`
    : `[chat] ${safeMessage}`;
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}
