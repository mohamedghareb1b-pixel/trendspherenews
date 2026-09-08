import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@example.com";

export default function CookiePolicyPage() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>Cookie Policy</h1>
      <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString("en-US")}</p>

      <p>
        This Cookie Policy explains what cookies are, how TrendSphere uses them, and your
        choices.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device that help websites remember
        information about your visit.
      </p>

      <h2>2. Cookies We Use</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Purpose</th>
            <th>Provider</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Strictly necessary</td>
            <td>Internal admin sign-in session (not used by regular visitors)</td>
            <td>TrendSphere</td>
          </tr>
          <tr>
            <td>Analytics</td>
            <td>Understand site usage and improve content</td>
            <td>Google Analytics, Microsoft Clarity</td>
          </tr>
          <tr>
            <td>Advertising</td>
            <td>Show relevant ads and measure ad performance</td>
            <td>Google AdSense</td>
          </tr>
          <tr>
            <td>Preferences</td>
            <td>Remember your cookie consent choice</td>
            <td>TrendSphere</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Your Choices</h2>
      <p>
        When you first visit our site, a cookie banner lets you accept or decline non-essential
        (analytics and advertising) cookies. You can change your choice at any time by clearing
        your browser&apos;s site data and reloading the page.
      </p>
      <p>
        You can also control cookies through your browser settings, or opt out of personalized
        advertising via{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>{" "}
        or{" "}
        <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
          www.aboutads.info
        </a>
        .
      </p>

      <h2>4. Changes to This Policy</h2>
      <p>We may update this Cookie Policy from time to time. Changes will be posted on this page.</p>

      <h2>5. Contact Us</h2>
      <p>
        Questions? Contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </article>
  );
}
