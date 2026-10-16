/**
 * Postgres notification read state — admin_notification_reads +
 * profiles.notifications_cleared_at (db/migrations/0011_admin_notifications.sql).
 */

import { isUuid } from "@/lib/db/ids";
import { query } from "@/lib/db/postgres/connection";
import type { NotificationReadsRepo } from "@/lib/db/repos/types";

/** Read rows older than this are pruned on write (derived items age out anyway). */
const RETAIN_DAYS = 120;

async function insertKeys(profileId: string, keys: string[]) {
  if (!keys.length) return;
  await query(
    `insert into admin_notification_reads (profile_id, notification_key)
     select $1::uuid, k from unnest($2::text[]) as k
     on conflict (profile_id, notification_key) do nothing`,
    [profileId, keys],
  );
  await query(
    `delete from admin_notification_reads
     where profile_id = $1::uuid and read_at < now() - ($2::int * interval '1 day')`,
    [profileId, RETAIN_DAYS],
  );
}

export function createPostgresNotificationReadsRepo(): NotificationReadsRepo {
  return {
    async getState(profileId) {
      if (!isUuid(profileId)) return { clearedAt: null, readKeys: new Set() };
      const [{ rows: profileRows }, { rows: readRows }] = await Promise.all([
        query<{ notifications_cleared_at: Date | string | null }>(
          `select notifications_cleared_at from profiles where id = $1`,
          [profileId],
        ),
        query<{ notification_key: string }>(
          `select notification_key from admin_notification_reads where profile_id = $1`,
          [profileId],
        ),
      ]);
      const cleared = profileRows[0]?.notifications_cleared_at ?? null;
      return {
        clearedAt: cleared ? new Date(cleared).toISOString() : null,
        readKeys: new Set(readRows.map((r) => r.notification_key)),
      };
    },

    async markRead(profileId, keys) {
      if (!isUuid(profileId)) return;
      await insertKeys(profileId, keys);
    },

    async markAll(profileId, keys) {
      if (!isUuid(profileId)) return;
      await insertKeys(profileId, keys);
      await query(
        `update profiles set notifications_cleared_at = now() where id = $1`,
        [profileId],
      );
    },
  };
}
