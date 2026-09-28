/**
 * "Before launch" checklist — what still stands between demo and a real launch.
 * Deliberately on the dashboard so blockers stop being invisible.
 *
 * clear = done; outstanding items link somewhere actionable.
 * Unknown facts use clear=false with honest detail — never pretend green.
 */

import { getAuthMode, isAuthConfigured } from "@/lib/admin/auth";
import { getPublishedContactInfo } from "@/lib/cms/public";
import { getStripeStatus } from "@/lib/stripe/config";

export type LaunchBlocker = {
  readonly id: string;
  readonly labelKey: string;
  readonly detailKey: string;
  readonly detailVars?: Record<string, string | number>;
  readonly clear: boolean;
  readonly href: string;
};

export function getLaunchBlockers(): LaunchBlocker[] {
  const mode = getAuthMode();
  const authConfigured = isAuthConfigured();
  const stripe = getStripeStatus();
  const contact = getPublishedContactInfo();
  const hoursLine = [
    contact.hours.weekdays,
    contact.hours.saturday,
    contact.hours.sunday,
  ]
    .filter(Boolean)
    .join(" · ");
  const contactOk = Boolean(contact.phone?.trim() && contact.email?.trim());

  let authDetailKey: string;
  if (!authConfigured) {
    authDetailKey =
      mode === "credentials"
        ? "pages.dashboard.blockerAuthCredentialsMissing"
        : "pages.dashboard.blockerAuthMissing";
  } else if (mode === "credentials") {
    authDetailKey = "pages.dashboard.blockerAuthCredentials";
  } else {
    authDetailKey = "pages.dashboard.blockerAuthStub";
  }

  let stripeDetailKey = "pages.dashboard.blockerStripeDetail";
  if (stripe.webhookReady) {
    stripeDetailKey = "pages.dashboard.blockerStripeWired";
  } else if (stripe.checkoutReady) {
    stripeDetailKey = "pages.dashboard.blockerStripePartial";
  }

  return [
    {
      id: "photos",
      labelKey: "pages.dashboard.blockerPhotos",
      detailKey: "pages.dashboard.blockerPhotosDetail",
      clear: false,
      href: "/gallery",
    },
    {
      id: "auth",
      labelKey: "pages.dashboard.blockerAuth",
      detailKey: authDetailKey,
      // Credentials mode is better than the stub but still not MFA / production-hardened.
      clear: false,
      href: "/admin/settings#settings-security",
    },
    {
      id: "db",
      labelKey: "pages.dashboard.blockerDb",
      detailKey: "pages.dashboard.blockerDbDetail",
      clear: false,
      href: "/admin/settings#settings-platform",
    },
    {
      id: "stripe",
      labelKey: "pages.dashboard.blockerStripe",
      detailKey: stripeDetailKey,
      // Scaffolding ≠ production-ready (test mode, receipts, reconciliation still open).
      clear: false,
      href: "/admin/settings#settings-platform",
    },
    {
      id: "hours",
      labelKey: "pages.dashboard.blockerHours",
      detailKey: contactOk
        ? "pages.dashboard.blockerHoursOk"
        : "pages.dashboard.blockerHoursMissing",
      detailVars: contactOk
        ? { hours: hoursLine || "—", phone: contact.phone, email: contact.email }
        : undefined,
      clear: contactOk && hoursLine.length > 0,
      href: "/admin/settings#settings-trust",
    },
  ];
}
