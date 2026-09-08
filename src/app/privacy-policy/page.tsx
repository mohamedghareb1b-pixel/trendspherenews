import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@example.com";

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>Privacy Policy</h1>
      <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString("en-US")}</p>

      <p>
        This Privacy Policy explains how TrendSphere (&quot;we&quot;, &quot;us&quot;, or
        &quot;our&quot;) collects, uses, and discloses information about visitors to our
        website. We do not require visitors to create an account or sign in to read our
        content.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>
          <strong>Newsletter subscription:</strong> your email address and any category
          preferences you select, if you choose to subscribe.
        </li>
        <li>
          <strong>Usage data:</strong> we record anonymous page views (page path and referrer)
          to understand which articles are popular. This does not use cookies or identify
          individual visitors.
        </li>
        <li>
          <strong>Cookies and similar technologies:</strong> see our{" "}
          <a href="/cookie-policy">Cookie Policy</a> for details.
        </li>
      </ul>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>To operate and improve the website and its content</li>
        <li>To send newsletter emails you've opted into (with a one-click unsubscribe link)</li>
        <li>To measure site performance and content popularity</li>
        <li>To serve relevant advertising (see Section 5)</li>
      </ul>

      <h2>3. Legal Basis &amp; Your Rights</h2>
      <p>
        Depending on your location, you may have rights under laws such as the California
        Consumer Privacy Act (CCPA/CPRA), the EU General Data Protection Regulation (GDPR), or
        similar state privacy laws (e.g. Virginia, Colorado). These rights may include:
      </p>
      <ul>
        <li>The right to know what personal information we hold about you</li>
        <li>The right to request deletion of your personal information</li>
        <li>The right to opt out of the sale or sharing of personal information</li>
        <li>The right to non-discrimination for exercising these rights</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>4. Third-Party Services</h2>
      <p>We use the following third-party services, each with its own privacy policy:</p>
      <ul>
        <li>Google Analytics / Google Tag Manager (usage analytics)</li>
        <li>Microsoft Clarity (usage analytics)</li>
        <li>Google AdSense (advertising)</li>
      </ul>

      <h2>5. Advertising &amp; Google AdSense</h2>
      <p>
        We may display ads served by Google AdSense. Google, as a third-party vendor, uses
        cookies to serve ads based on a user&apos;s prior visits to this or other websites. You
        may opt out of personalized advertising by visiting{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>
        , or opt out of some third-party vendor cookies via{" "}
        <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
          www.aboutads.info
        </a>
        .
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain newsletter subscriber data for as long as your subscription is active, or as
        needed to comply with legal obligations.
      </p>

      <h2>7. Children&apos;s Privacy</h2>
      <p>
        Our website is not directed at children under 13, and we do not knowingly collect
        personal information from children under 13 (or the applicable age in your jurisdiction).
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. Changes will be posted on this page.</p>

      <h2>9. Contact Us</h2>
      <p>
        Questions about this policy? Contact us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <hr />
      <p className="text-sm text-gray-500">
        This is a template. Have this document reviewed by a qualified attorney before relying
        on it for legal compliance.
      </p>
    </article>
  );
}
