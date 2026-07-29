import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@example.com";

export default function TermsOfServicePage() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>Terms of Service</h1>
      <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString("en-US")}</p>

      <p>
        By accessing or using TrendSphere (&quot;the Service&quot;), you agree to be bound by
        these Terms of Service. If you do not agree, please do not use the Service.
      </p>

      <h2>1. Use of the Service</h2>
      <p>
        You may use the Service for lawful purposes only. You agree not to misuse the Service,
        including attempting to gain unauthorized access, disrupting the Service, or scraping
        content in violation of our robots.txt directives.
      </p>

      <h2>2. Content</h2>
      <p>
        All articles, images, and other content published on the Service are owned by
        TrendSphere or its licensors, unless otherwise noted, and are protected by copyright and
        other intellectual property laws. You may not reproduce or redistribute our content
        without permission, except for personal, non-commercial use with proper attribution.
      </p>

      <h2>3. User-Submitted Content</h2>
      <p>
        If the Service allows comments or submissions, you retain ownership of what you submit,
        but grant us a worldwide, royalty-free license to use, display, and distribute it in
        connection with operating the Service.
      </p>

      <h2>4. Third-Party Links &amp; Ads</h2>
      <p>
        The Service may display advertisements (including via Google AdSense) and links to
        third-party websites. We are not responsible for the content or practices of third-party
        sites.
      </p>

      <h2>5. Disclaimer of Warranties</h2>
      <p>
        The Service is provided &quot;as is&quot; without warranties of any kind, express or
        implied. We do not warrant that the Service will be uninterrupted, error-free, or free
        of harmful components.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, TrendSphere shall not be liable for any indirect,
        incidental, special, consequential, or punitive damages arising from your use of the
        Service.
      </p>

      <h2>7. Termination</h2>
      <p>
        We may suspend or restrict access to the Service at any time, with or without notice,
        for conduct that violates these Terms.
      </p>

      <h2>8. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the United States and the state in which
        TrendSphere is registered, without regard to conflict-of-law principles.
      </p>

      <h2>9. Changes to These Terms</h2>
      <p>We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance.</p>

      <h2>10. Contact Us</h2>
      <p>
        Questions about these Terms? Contact us at{" "}
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
