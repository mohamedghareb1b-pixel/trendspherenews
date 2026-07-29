import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Policy",
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@example.com";
const COMPANY_ADDRESS = process.env.COMPANY_MAILING_ADDRESS ?? "[Company mailing address]";

export default function DmcaPage() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>DMCA Policy</h1>
      <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString("en-US")}</p>

      <p>
        TrendSphere respects the intellectual property rights of others and expects its users to
        do the same. In accordance with the Digital Millennium Copyright Act of 1998 (&quot;DMCA&quot;),
        we will respond promptly to notices of alleged copyright infringement.
      </p>

      <h2>Filing a DMCA Takedown Notice</h2>
      <p>
        If you believe content on our site infringes your copyright, please send a written
        notice to our Designated Agent that includes:
      </p>
      <ol>
        <li>A physical or electronic signature of the copyright owner or authorized representative</li>
        <li>Identification of the copyrighted work claimed to have been infringed</li>
        <li>Identification of the material claimed to be infringing, including its URL on our site</li>
        <li>Your contact information (address, phone number, email)</li>
        <li>
          A statement that you have a good-faith belief the use is not authorized by the
          copyright owner, its agent, or the law
        </li>
        <li>
          A statement, made under penalty of perjury, that the information in the notice is
          accurate and that you are authorized to act on behalf of the copyright owner
        </li>
      </ol>

      <h2>Designated Agent</h2>
      <p>
        TrendSphere
        <br />
        Attn: DMCA Designated Agent
        <br />
        Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <br />
        Address: {COMPANY_ADDRESS}
      </p>

      <h2>Counter-Notification</h2>
      <p>
        If you believe material you posted was removed in error, you may submit a
        counter-notification containing:
      </p>
      <ol>
        <li>Your physical or electronic signature</li>
        <li>Identification of the material removed and its location before removal</li>
        <li>
          A statement, under penalty of perjury, that you have a good-faith belief the material
          was removed as a result of mistake or misidentification
        </li>
        <li>Your name, address, phone number, and consent to the jurisdiction of the applicable federal court</li>
      </ol>

      <h2>Repeat Infringers</h2>
      <p>
        We will, in appropriate circumstances, take action against repeat infringers, which may
        include removing their submitted content and blocking further submissions.
      </p>

      <hr />
      <p className="text-sm text-gray-500">
        This is a template. Replace the placeholder contact details above and have this document
        reviewed by a qualified attorney before relying on it for legal compliance.
      </p>
    </article>
  );
}
