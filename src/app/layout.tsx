import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { getSiteUrl } from "@/lib/site";
import { organizationJsonLd, websiteJsonLd, jsonLdScriptProps } from "@/lib/seo";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { AdSlot } from "@/components/AdSlot";
import { CookieConsent } from "@/components/CookieConsent";
import { container } from "@/lib/container";
import { SITE_SETTING_KEYS } from "@/application/use-cases/SiteSettingsUseCases";

const bodyFont = Inter({ subsets: ["latin"], variable: "--font-body" });
const headingFont = Lora({ subsets: ["latin"], variable: "--font-heading" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await container.getSiteSettings.execute();

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: "TrendSphere",
      template: "%s | TrendSphere",
    },
    description:
      "An intelligent publishing platform that turns every article into a full content network.",
    alternates: {
      canonical: "/",
      types: { "application/rss+xml": "/rss.xml" },
    },
    verification: {
      google: settings[SITE_SETTING_KEYS.GOOGLE_SITE_VERIFICATION] || undefined,
      other: {
        "msvalidate.01": settings[SITE_SETTING_KEYS.BING_SITE_VERIFICATION] || "",
      },
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await container.getSiteSettings.execute();

  return (
    <html lang="en" dir="ltr" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body className="font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3 focus:text-brand-700"
        >
          Skip to main content
        </a>
        <AnalyticsScripts
          gaId={settings[SITE_SETTING_KEYS.GA_MEASUREMENT_ID]}
          clarityId={settings[SITE_SETTING_KEYS.CLARITY_ID]}
        />
        <script {...jsonLdScriptProps(organizationJsonLd())} />
        <script {...jsonLdScriptProps(websiteJsonLd())} />
        <AuthProvider>
          <header className="border-b border-gray-100 py-4">
            <div className="mx-auto flex max-w-5xl items-center gap-3 px-4">
              <Link href="/" className="text-xl font-bold text-brand-700">
                TrendSphere
              </Link>
              {settings[SITE_SETTING_KEYS.HEADER_BADGE_TEXT] && (
                <span className="rounded-full bg-gradient-to-r from-amber-400 to-pink-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  {settings[SITE_SETTING_KEYS.HEADER_BADGE_TEXT]}
                </span>
              )}
            </div>
          </header>
          <main id="main-content" className="mx-auto max-w-5xl px-4 py-8">
            {children}
          </main>
          <div className="mx-auto max-w-5xl px-4">
            <AdSlot slotKey="footer" />
          </div>
          <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
            <nav
              aria-label="Legal links"
              className="mb-3 flex flex-wrap justify-center gap-4"
            >
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-service">Terms of Service</Link>
              <Link href="/cookie-policy">Cookie Policy</Link>
              <Link href="/dmca">DMCA</Link>
            </nav>
            © {new Date().getFullYear()} TrendSphere OS
          </footer>
        </AuthProvider>
        <CookieConsent />
      </body>
    </html>
  );
}