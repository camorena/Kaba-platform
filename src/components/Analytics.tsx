import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

/**
 * Privacy-friendly analytics:
 * - @vercel/analytics: cookieless, works on Vercel without a paid key
 * - Optional Plausible: set NEXT_PUBLIC_PLAUSIBLE_DOMAIN (e.g. kabafence.com)
 * No cookie banner — neither script uses tracking cookies.
 */
export default function Analytics() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();

  return (
    <>
      <VercelAnalytics />
      {plausibleDomain ? (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}
