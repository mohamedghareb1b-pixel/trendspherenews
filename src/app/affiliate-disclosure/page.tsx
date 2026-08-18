import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@example.com";

export default function AffiliateDisclosurePage() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>Affiliate Disclosure</h1>
      <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString("en-US")}</p>

      <p>
        TrendSphere participates in affiliate marketing programs, which means we may earn a
        commission when you click on certain links and make a purchase or booking through them.
        This comes at no additional cost to you.
      </p>

      <h2>Ticket Links</h2>
      <p>
        Some articles include links to purchase event tickets (concerts, sports matches, and
        similar events). These links point to third-party ticket resale marketplaces, not
        primary/official ticket sellers. Prices on these platforms may be higher or lower than
        face value, and availability is not guaranteed. We may earn a commission from these
        links.
      </p>

      <h2>Product and Merchant Links</h2>
      <p>
        TrendSphere uses automated affiliate link technology (such as Sovrn Commerce) that may
        convert eligible outbound links in our articles into affiliate links. This means some
        links to products, services, or merchants mentioned in our content may generate a
        commission for us if you make a purchase, at no extra cost to you.
      </p>

      <h2>Our Editorial Independence</h2>
      <p>
        Affiliate relationships do not influence our editorial content or reporting. Articles
        are researched and written based on their newsworthiness and relevance to our readers,
        not based on potential commission earnings. Our editorial standards apply equally to all
        content regardless of any affiliate relationship.
      </p>

      <h2>Transparency Commitment</h2>
      <p>
        TrendSphere is committed to being transparent about how we operate and how our content
        is produced. Our articles are researched using a mix of AI-assisted research and human
        editorial review before publishing. Any sponsored content, if published, will be clearly
        labeled as such. We do not accept payment in exchange for favorable coverage.
      </p>

      <h2>Why We Disclose This</h2>
      <p>
        We believe in transparency with our readers. This disclosure is made in accordance with
        the Federal Trade Commission&apos;s (FTC) guidelines concerning the use of endorsements
        and testimonials in advertising.
      </p>

      <h2>Questions</h2>
      <p>
        If you have any questions about our affiliate relationships, please contact us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </article>
  );
}
