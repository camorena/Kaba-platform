/**
 * Gone-quiet morning digest — Vercel Cron target.
 *
 * Schedule (vercel.json): `0 12 * * *` UTC
 *   → 07:00 America/Chicago during CDT (UTC-5)
 *   → 06:00 America/Chicago during CST (UTC-6)
 *
 * Auth: Bearer CRON_SECRET and/or x-vercel-cron: 1 (see src/lib/cron/auth.ts).
 *
 * Always returns 200 when authorized (even if mail is off or list is empty)
 * so cron logs stay readable; unauthorized → 401.
 */

import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron/auth";
import { listQuietQuotes, QUIET_DAYS_THRESHOLD } from "@/lib/admin/quotes-store";
import { notifyQuietDigest } from "@/lib/db/notify";
import { getMailStatus } from "@/lib/mail";
import { getDataAdapterName } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Allow a few seconds for DB + Resend on cold start. */
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Unauthorized. Set CRON_SECRET and send Authorization: Bearer …, or invoke via Vercel Cron.",
      },
      { status: 401 },
    );
  }

  const mail = getMailStatus();
  let quiet;
  try {
    quiet = await listQuietQuotes();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[cron/quiet-digest] listQuietQuotes failed:", message);
    return NextResponse.json(
      {
        ok: false,
        error: `Failed to load quiet quotes: ${message}`,
        adapter: getDataAdapterName(),
        thresholdDays: QUIET_DAYS_THRESHOLD,
      },
      { status: 500 },
    );
  }

  const quietCount = quiet.length;

  // Empty list — honest skip (still 200 for cron).
  if (quietCount === 0) {
    return NextResponse.json({
      ok: true,
      emailed: false,
      quietCount: 0,
      thresholdDays: QUIET_DAYS_THRESHOLD,
      adapter: getDataAdapterName(),
      mailReady: mail.ready,
      mailTransport: mail.transport,
      reason: "No quiet leads — digest skipped.",
    });
  }

  // Mail not configured — still 200 with reason (do not invent keys).
  if (!mail.ready) {
    return NextResponse.json({
      ok: true,
      emailed: false,
      quietCount,
      thresholdDays: QUIET_DAYS_THRESHOLD,
      adapter: getDataAdapterName(),
      mailReady: false,
      mailTransport: mail.transport,
      reason:
        "Mail not configured — set MAIL_FROM + RESEND_API_KEY (or SMTP_HOST). Digest not sent.",
      sample: quiet.slice(0, 5).map((q) => ({
        id: q.id,
        name: q.name,
        status: q.status,
        updatedAt: q.updatedAt,
      })),
    });
  }

  const result = await notifyQuietDigest(quiet);
  console.info(
    "[cron/quiet-digest] quiet=%d delivered=%s — %s",
    quietCount,
    result.delivered,
    result.reason,
  );

  return NextResponse.json({
    ok: true,
    emailed: result.delivered,
    quietCount: result.quietCount,
    thresholdDays: QUIET_DAYS_THRESHOLD,
    adapter: getDataAdapterName(),
    mailReady: true,
    mailTransport: mail.transport,
    reason: result.reason,
    to: result.to,
    bcc: result.bcc,
  });
}

/** POST mirrors GET so manual ops curls stay flexible. */
export async function POST(request: Request) {
  return GET(request);
}
