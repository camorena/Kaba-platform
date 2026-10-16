import { NextResponse } from "next/server";
import {
  checkIntakeRateLimit,
  createQuoteAndNotify,
  EMAIL_RE,
  PHONE_RE,
} from "@/lib/quotes/intake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHAT_LEAD_SOURCE = "chat-widget";
const CHAT_LEAD_SERVICE = "Callback request (website chat)";

const LIMITS = { name: 200, phone: 40, email: 254, message: 2000 } as const;

/**
 * Public chat-widget lead → saved as a quote (source "chat-widget") through the
 * same persist-then-notify path as the quote form: owner alert + always-copy,
 * customer confirmation when an email is given.
 */
export async function POST(request: Request) {
  const rate = checkIntakeRateLimit(request);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(data.name);
  const phone = str(data.phone);
  const email = str(data.email).toLowerCase();
  const message = str(data.message);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required.";
  else if (name.length > LIMITS.name) errors.name = "Name is too long.";
  if (!phone) errors.phone = "Phone is required.";
  else if (phone.length > LIMITS.phone || !PHONE_RE.test(phone)) {
    errors.phone = "Enter a valid phone number.";
  }
  if (email && (email.length > LIMITS.email || !EMAIL_RE.test(email))) {
    errors.email = "Enter a valid email.";
  }
  if (message.length > LIMITS.message) errors.message = "Message is too long.";
  if (Object.keys(errors).length) {
    return NextResponse.json(
      { error: "Invalid lead.", fields: errors },
      { status: 400 },
    );
  }

  const { quote, notified } = await createQuoteAndNotify({
    name,
    phone,
    email,
    serviceType: CHAT_LEAD_SERVICE,
    address: "",
    description: message || "Asked for a callback from the website chat.",
    preferredContact: "phone",
    source: CHAT_LEAD_SOURCE,
  });

  return NextResponse.json(
    { ok: true, id: quote.id, notified },
    { status: 201 },
  );
}
