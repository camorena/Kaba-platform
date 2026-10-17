import type { DataRepos } from "@/lib/db/repos/types";
import { memoryCustomersRepo } from "@/lib/db/memory/customers";
import { memoryInvoicesRepo } from "@/lib/db/memory/invoices";
import { memoryPaymentsRepo } from "@/lib/db/memory/payments";
import {
  isQuietQuote,
  memoryQuotesRepo,
  QUIET_DAYS_THRESHOLD,
  QUIET_QUOTE_STATUSES,
} from "@/lib/db/memory/quotes";
import {
  DEFAULT_TRUST_CLAIMS,
  memoryTrustClaimsRepo,
} from "@/lib/db/memory/trust-claims";
import { memoryProfilesRepo } from "@/lib/db/memory/profiles";
import { memoryNotificationReadsRepo } from "@/lib/db/memory/notification-reads";
import {
  memoryHighlightStatsRepo,
  memoryReviewsRepo,
} from "@/lib/db/memory/reviews";

export function createMemoryRepos(): DataRepos {
  return {
    adapter: "memory",
    quotes: memoryQuotesRepo,
    invoices: memoryInvoicesRepo,
    payments: memoryPaymentsRepo,
    customers: memoryCustomersRepo,
    trustClaims: memoryTrustClaimsRepo,
    profiles: memoryProfilesRepo,
    notificationReads: memoryNotificationReadsRepo,
    reviews: memoryReviewsRepo,
    highlightStats: memoryHighlightStatsRepo,
  };
}

export {
  memoryCustomersRepo,
  memoryInvoicesRepo,
  memoryPaymentsRepo,
  memoryQuotesRepo,
  memoryTrustClaimsRepo,
  memoryProfilesRepo,
  QUIET_DAYS_THRESHOLD,
  QUIET_QUOTE_STATUSES,
  isQuietQuote,
  DEFAULT_TRUST_CLAIMS,
};
