/**
 * Server side of the admin bell: load real records, derive items, attach the
 * signed-in admin's read state. Stub-auth sessions (no profiles row) keep read
 * state in process memory only.
 */

import "server-only";

import type { SessionAdmin } from "@/lib/admin/dal";
import {
  applyReadState,
  deriveNotifications,
  type AdminNotification,
} from "@/lib/admin/notifications-derive";
import { getRepos } from "@/lib/db/adapter";
import { isUuid } from "@/lib/db/ids";
import { memoryNotificationReadsRepo } from "@/lib/db/memory/notification-reads";
import type { NotificationReadsRepo } from "@/lib/db/repos/types";

export const MAX_NOTIFICATIONS = 50;

function readsRepoFor(admin: SessionAdmin): NotificationReadsRepo {
  return isUuid(admin.id) && !admin.stub
    ? getRepos().notificationReads
    : memoryNotificationReadsRepo;
}

async function deriveCurrent() {
  const repos = getRepos();
  const [quotes, invoices, payments, paidByInvoiceId] = await Promise.all([
    repos.quotes.list(),
    repos.invoices.list(),
    repos.payments.list(),
    repos.payments.paidCentsMap(),
  ]);
  return deriveNotifications({ quotes, invoices, payments, paidByInvoiceId });
}

export async function getAdminNotifications(admin: SessionAdmin): Promise<{
  items: AdminNotification[];
  unreadCount: number;
  total: number;
}> {
  const [derived, state] = await Promise.all([
    deriveCurrent(),
    readsRepoFor(admin).getState(admin.id),
  ]);
  const all = applyReadState(derived, state);
  return {
    items: all.slice(0, MAX_NOTIFICATIONS),
    unreadCount: all.filter((n) => n.unread).length,
    total: all.length,
  };
}

export async function markAdminNotificationsRead(
  admin: SessionAdmin,
  request: { keys?: string[]; all?: boolean },
): Promise<void> {
  const repo = readsRepoFor(admin);
  if (request.all) {
    const keys = (await deriveCurrent()).map((n) => n.key);
    await repo.markAll(admin.id, keys);
    return;
  }
  const keys = (request.keys ?? []).filter(
    (k) => typeof k === "string" && k.length > 0 && k.length <= 200,
  );
  if (keys.length) await repo.markRead(admin.id, keys.slice(0, 200));
}
