/**
 * Postgres QuotesRepo — same contract as Memory*.
 */

import { query } from "@/lib/db/postgres/connection";
import {
  mapQuote,
  mapQuoteNote,
  type QuoteNoteRow,
  type QuoteRow,
} from "@/lib/db/postgres/mappers";
import {
  isQuietQuote,
  QUIET_DAYS_THRESHOLD,
} from "@/lib/db/quiet";
import type { QuotesRepo } from "@/lib/db/repos/types";
import type { NewQuoteInput, QuotePatch, QuoteStatus } from "@/lib/db/types";
import {
  defaultScheduledFor,
  isVisitReminderCandidate,
  VISIT_REMINDER_STATUSES,
} from "@/lib/db/visits";

export function createPostgresQuotesRepo(): QuotesRepo {
  return {
    async list() {
      const { rows } = await query<QuoteRow>(
        `select * from quotes order by created_at desc`,
      );
      return rows.map(mapQuote);
    },

    async get(id) {
      const { rows } = await query<QuoteRow>(
        `select * from quotes where id = $1`,
        [id],
      );
      return rows[0] ? mapQuote(rows[0]) : undefined;
    },

    async add(input: NewQuoteInput) {
      const status = input.status ?? "new";
      const scheduledFor =
        input.scheduledFor ??
        (VISIT_REMINDER_STATUSES.includes(status)
          ? defaultScheduledFor(status)
          : null);
      const { rows } = await query<QuoteRow>(
        `insert into quotes (
           customer_id, name, phone, email, service_type, address, description,
           preferred_contact, source, status, notes, scheduled_for
         ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         returning *`,
        [
          input.customerId ?? null,
          input.name,
          input.phone,
          input.email,
          input.serviceType,
          input.address,
          input.description,
          input.preferredContact,
          input.source,
          status,
          input.notes ?? "",
          scheduledFor,
        ],
      );
      return mapQuote(rows[0]);
    },

    async update(id, patch: QuotePatch) {
      const existing = await this.get(id);
      if (!existing) return undefined;

      const status = patch.status ?? existing.status;
      const notes = patch.notes ?? existing.notes;
      const notifiedAt =
        patch.notifiedAt !== undefined ? patch.notifiedAt : existing.notifiedAt;
      const notifyAttempts =
        patch.notifyAttempts !== undefined
          ? patch.notifyAttempts
          : existing.notifyAttempts;

      let scheduledFor =
        patch.scheduledFor !== undefined
          ? patch.scheduledFor
          : existing.scheduledFor;
      // Auto-assign calendar day when entering scheduled/won without a date.
      if (
        VISIT_REMINDER_STATUSES.includes(status) &&
        !scheduledFor &&
        patch.scheduledFor === undefined
      ) {
        scheduledFor = defaultScheduledFor(status);
      }
      // Clear reminder stamp when the visit day changes.
      let visitReminderSentAt =
        patch.visitReminderSentAt !== undefined
          ? patch.visitReminderSentAt
          : existing.visitReminderSentAt;
      if (
        patch.scheduledFor !== undefined &&
        patch.scheduledFor !== existing.scheduledFor
      ) {
        visitReminderSentAt =
          patch.visitReminderSentAt !== undefined
            ? patch.visitReminderSentAt
            : null;
      }

      const { rows } = await query<QuoteRow>(
        `update quotes set
           status = $2,
           notes = $3,
           notified_at = $4,
           notify_attempts = $5,
           scheduled_for = $6,
           visit_reminder_sent_at = $7,
           updated_at = now()
         where id = $1
         returning *`,
        [
          id,
          status,
          notes,
          notifiedAt,
          notifyAttempts,
          scheduledFor,
          visitReminderSentAt,
        ],
      );
      return rows[0] ? mapQuote(rows[0]) : undefined;
    },

    async bulkUpdateStatus(ids, status: QuoteStatus) {
      if (!ids.length) return { updated: 0, missing: [] };
      const defaultDay = defaultScheduledFor(status);
      const { rows } = await query<{ id: string }>(
        `update quotes set
           status = $1,
           scheduled_for = case
             when scheduled_for is null and $3::date is not null then $3::date
             else scheduled_for
           end,
           updated_at = now()
         where id = any($2::uuid[])
         returning id`,
        [status, ids, defaultDay],
      );
      const updatedIds = new Set(rows.map((r) => r.id));
      const missing = ids.filter((id) => !updatedIds.has(id));
      return { updated: rows.length, missing };
    },

    async stats() {
      const { rows } = await query<{ status: QuoteStatus; n: string }>(
        `select status, count(*)::text as n from quotes group by status`,
      );
      const counts: Record<QuoteStatus, number> = {
        new: 0,
        contacted: 0,
        scheduled: 0,
        won: 0,
        lost: 0,
      };
      let total = 0;
      for (const row of rows) {
        const n = Number(row.n) || 0;
        counts[row.status] = n;
        total += n;
      }
      return { total, ...counts };
    },

    async listQuiet(thresholdDays = QUIET_DAYS_THRESHOLD) {
      const all = await this.list();
      const now = Date.now();
      return all
        .filter((q) => isQuietQuote(q, thresholdDays, now))
        .sort((a, b) => +new Date(a.updatedAt) - +new Date(b.updatedAt));
    },

    async quietCount(thresholdDays = QUIET_DAYS_THRESHOLD) {
      return (await this.listQuiet(thresholdDays)).length;
    },

    async listDueVisitReminders(tomorrowYmd) {
      const { rows } = await query<QuoteRow>(
        `select * from quotes
         where status = any($1::quote_status[])
           and scheduled_for = $2::date
           and visit_reminder_sent_at is null
           and length(btrim(email)) > 0
         order by name asc`,
        [VISIT_REMINDER_STATUSES, tomorrowYmd],
      );
      return rows.map(mapQuote).filter((q) =>
        isVisitReminderCandidate(q, tomorrowYmd),
      );
    },

    async markVisitReminderSent(id, at) {
      const stamp = at === undefined ? new Date().toISOString() : at;
      const { rows } = await query<QuoteRow>(
        `update quotes set
           visit_reminder_sent_at = $2,
           updated_at = now()
         where id = $1
         returning *`,
        [id, stamp],
      );
      return rows[0] ? mapQuote(rows[0]) : undefined;
    },

    async listNotes(quoteId) {
      const { rows } = await query<QuoteNoteRow>(
        `select * from quote_notes where quote_id = $1 order by created_at desc`,
        [quoteId],
      );
      return rows.map(mapQuoteNote);
    },

    async addNote(quoteId, body, author) {
      const trimmed = body.trim();
      if (!trimmed) return null;
      const quote = await this.get(quoteId);
      if (!quote) return null;

      const { rows } = await query<QuoteNoteRow>(
        `insert into quote_notes (quote_id, author_id, author_label, body)
         values ($1, $2, $3, $4)
         returning *`,
        [
          quoteId,
          author?.id ?? null,
          author?.label ?? "ops",
          trimmed,
        ],
      );
      await query(`update quotes set updated_at = now() where id = $1`, [
        quoteId,
      ]);
      return mapQuoteNote(rows[0]);
    },
  };
}
