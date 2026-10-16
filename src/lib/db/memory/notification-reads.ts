/**
 * In-process notification read state — memory adapter, and the fallback for
 * stub-auth sessions (no profiles row). Resets on cold start by design.
 */

import type {
  NotificationReadsRepo,
  NotificationReadState,
} from "@/lib/db/repos/types";

type Entry = { clearedAt: string | null; readKeys: Set<string> };

const globalStore = globalThis as unknown as {
  __kabaNotificationReads?: Map<string, Entry>;
};

function store(): Map<string, Entry> {
  if (!globalStore.__kabaNotificationReads) {
    globalStore.__kabaNotificationReads = new Map();
  }
  return globalStore.__kabaNotificationReads;
}

function entry(profileId: string): Entry {
  let e = store().get(profileId);
  if (!e) {
    e = { clearedAt: null, readKeys: new Set() };
    store().set(profileId, e);
  }
  return e;
}

export const memoryNotificationReadsRepo: NotificationReadsRepo = {
  async getState(profileId): Promise<NotificationReadState> {
    const e = entry(profileId);
    return { clearedAt: e.clearedAt, readKeys: new Set(e.readKeys) };
  },
  async markRead(profileId, keys) {
    const e = entry(profileId);
    for (const k of keys) e.readKeys.add(k);
  },
  async markAll(profileId, keys) {
    const e = entry(profileId);
    for (const k of keys) e.readKeys.add(k);
    e.clearedAt = new Date().toISOString();
  },
};
