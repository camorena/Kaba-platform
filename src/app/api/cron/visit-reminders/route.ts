/**
 * Tomorrow visit / install reminders — Vercel Cron target.
 *
 * Schedule (vercel.json): `15 12 * * *` UTC
 *   → 07:15 America/Chicago during CDT (UTC-5)
 *   → 06:15 America/Chicago during CST (UTC-6)
 * Quiet digest stays at `0 12 * * *` UTC (~07:00 CDT) — at least 15 minutes apart.
 *
 * Auth: Bearer CRON_SECRET and/or x-vercel-cron: 1 (see src/lib/cron/auth.ts).
 *
 * Entity: quotes with status scheduled (site visit) or won (install window)
 * that have scheduled_for = tomorrow (America/Chicago) and no visit_reminder_sent_at.
 *
 * Always returns 200 when authorized (even if mail is off or list is empty)
 * so cron logs stay readable; unauthorized → 401.
 */

import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron/auth";
import { listDueVisitReminders } from "@/lib/admin/quotes-store";
import { notifyVisitReminder } from "@/lib/db/notify";
import { getMailStatus } from "@/lib/mail";
import {
  getAutoVisitRemindersPosture,
  isAutoVisitRemindersEnabled,
} from "@/lib/mail/auto-visit-reminders";
import { getDataAdapterName } from "@/lib/db";
import { chicagoTomorrowYmd } from "@/lib/db/visits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
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
  const posture = getAutoVisitRemindersPosture();
  const tomorrow = chicagoTomorrowYmd();

  let due;
  try {
    due = await listDueVisitReminders(tomorrow);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[cron/visit-reminders] listDueVisitReminders failed:", message);
    return NextResponse.json(
      {
        ok: false,
        error: `Failed to load due visits: ${message}`,
        adapter: getDataAdapterName(),
        tomorrow,
      },
      { status: 500 },
    );
  }

  const dueCount = due.length;

  if (!isAutoVisitRemindersEnabled()) {
    return NextResponse.json({
      ok: true,
      emailed: false,
      dueCount,
      sent: 0,
      tomorrow,
      adapter: getDataAdapterName(),
      mailReady: mail.ready,
      mailTransport: mail.transport,
      auto: posture,
      reason:
        "Visit reminders disabled (KABA_AUTO_VISIT_REMINDERS=false, or mail not configured for default ON).",
    });
  }

  if (dueCount === 0) {
    return NextResponse.json({
      ok: true,
      emailed: false,
      dueCount: 0,
      sent: 0,
      tomorrow,
      adapter: getDataAdapterName(),
      mailReady: mail.ready,
      mailTransport: mail.transport,
      auto: posture,
      reason: "No visits scheduled for tomorrow — reminders skipped.",
    });
  }

  if (!mail.ready) {
    return NextResponse.json({
      ok: true,
      emailed: false,
      dueCount,
      sent: 0,
      tomorrow,
      adapter: getDataAdapterName(),
      mailReady: false,
      mailTransport: mail.transport,
      auto: posture,
      reason:
        "Mail not configured — set MAIL_FROM + RESEND_API_KEY (or SMTP_HOST). Reminders not sent.",
      sample: due.slice(0, 5).map((q) => ({
        id: q.id,
        name: q.name,
        status: q.status,
        scheduledFor: q.scheduledFor,
        email: q.email ? "(present)" : "",
      })),
    });
  }

  let sent = 0;
  let failed = 0;
  const results: Array<{
    id: string;
    delivered: boolean;
    skipped: boolean;
    reason: string;
    to?: string;
  }> = [];

  for (const quote of due) {
    const result = await notifyVisitReminder(quote);
    results.push({
      id: quote.id,
      delivered: result.delivered,
      skipped: result.skipped,
      reason: result.reason,
      to: result.to,
    });
    if (result.delivered) sent += 1;
    else if (!result.skipped) failed += 1;
  }

  console.info(
    "[cron/visit-reminders] tomorrow=%s due=%d sent=%d failed=%d",
    tomorrow,
    dueCount,
    sent,
    failed,
  );

  return NextResponse.json({
    ok: true,
    emailed: sent > 0,
    dueCount,
    sent,
    failed,
    tomorrow,
    adapter: getDataAdapterName(),
    mailReady: true,
    mailTransport: mail.transport,
    auto: posture,
    reason:
      sent > 0
        ? `Sent ${sent} of ${dueCount} visit reminder${dueCount === 1 ? "" : "s"}.`
        : `No reminders delivered (${dueCount} due).`,
    results: results.slice(0, 40),
  });
}

/** POST mirrors GET so manual ops curls stay flexible. */
export async function POST(request: Request) {
  return GET(request);
}
