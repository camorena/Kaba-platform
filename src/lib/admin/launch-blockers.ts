/**
 * "Before launch" checklist — what still stands between demo and a real launch.
 * Deliberately on the dashboard so blockers stop being invisible.
 *
 * clear = done; outstanding items link somewhere actionable.
 * Unknown facts use clear=false with honest detail — never pretend green.
 */

import { getAdminPassword } from "@/lib/admin/auth";
import { siteConfig } from "@/lib/site";

export type LaunchBlocker = {
  readonly id: string;
  readonly labelKey: string;
  readonly detailKey: string;
  readonly detailVars?: Record<string, string | number>;
  readonly clear: boolean;
  readonly href: string;
};

export function getLaunchBlockers(): LaunchBlocker[] {
  const authConfigured = Boolean(getAdminPassword());
  const hoursLine = [
    siteConfig.hours.weekdays,
    siteConfig.hours.saturday,
    siteConfig.hours.sunday,
  ]
    .filter(Boolean)
    .join(" · ");
  const contactOk = Boolean(siteConfig.phone?.trim() && siteConfig.email?.trim());

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
      detailKey: authConfigured
        ? "pages.dashboard.blockerAuthStub"
        : "pages.dashboard.blockerAuthMissing",
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
      detailKey: "pages.dashboard.blockerStripeDetail",
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
        ? { hours: hoursLine || "—", phone: siteConfig.phone, email: siteConfig.email }
        : undefined,
      // Hours/contact live in site.ts today — marked clear when present there.
      // Settings business fields will own this once the DB lands.
      clear: contactOk && hoursLine.length > 0,
      href: "/admin/settings#settings-trust",
    },
  ];
}
