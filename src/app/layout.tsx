import type { Metadata } from "next";
import { DM_Sans, Fraunces, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import Analytics from "@/components/Analytics";
import { siteConfig, siteUrl } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const defaultDescription =
  "Local fence and deck installation, repairs, and free estimates in Angier, Raleigh, and surrounding NC communities.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} | Fence & Deck Repair in Angier & Raleigh`,
    template: `%s | ${siteConfig.name}`,
  },
  description: defaultDescription,
  keywords: [
    "fence installation",
    "deck repair",
    "Angier NC",
    "Raleigh fence",
    "vinyl fence",
    "cedar privacy fence",
    "free fence estimate",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Fence & Deck Repair in Angier & Raleigh`,
    description: defaultDescription,
    images: [
      {
        url: "/gallery/cedar-privacy.jpg",
        width: 1280,
        height: 720,
        alt: "Cedar privacy fence installation by Kaba Fence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Fence & Deck Repair in Angier & Raleigh`,
    description: defaultDescription,
    images: ["/gallery/cedar-privacy.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
