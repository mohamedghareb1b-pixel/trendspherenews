import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about TrendSphere, our mission, and how we create our content.",
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@example.com";

export default function AboutPage() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>About TrendSphere</h1>

      <p>
        TrendSphere is an independent publication covering today's biggest trending stories
        across politics, technology, sports, business, and culture. We publish clear,
        well-researched articles aimed at helping readers quickly understand what's happening
        and why it matters.
      </p>

      <h2>Our Mission</h2>
      <p>
        Our goal is simple: give readers accurate, easy-to-digest information without the
        clutter. Every article is written to directly answer the question a reader came with,
        backed by credible sources.
      </p>

      <h2>Who's Behind TrendSphere</h2>
      <p>
        TrendSphere is founded and run by Muhammad Gharib, an independent publisher focused on
        making today's biggest trending stories clear and accessible to everyday readers.
        TrendSphere started in 2026 with a simple idea: build a publication that respects
        readers' time and intelligence.
      </p>

      <h2>How We Create Our Content</h2>
      <p>
        Our editorial process combines AI-assisted research and drafting with human review
        before publication. Every article is checked for accuracy, clarity, and relevance
        before it goes live. We believe in being transparent about our process rather than
        hiding it - our priority is that every piece of content is genuinely useful, not that
        it appears to come from any particular source.
      </p>
      <p>
        We do not publish content we believe to be false or misleading, and we correct errors
        promptly when they're brought to our attention (see &quot;Corrections&quot; below).
      </p>

      <h2>Editorial Standards</h2>
      <ul>
        <li>We cite credible, verifiable sources for factual claims, especially in news coverage.</li>
        <li>We distinguish clearly between reporting and opinion.</li>
        <li>We do not accept payment in exchange for favorable coverage.</li>
        <li>Sponsored content or affiliate links, if used, are clearly disclosed.</li>
      </ul>

      <h2>Corrections</h2>
      <p>
        If you spot an error in one of our articles, please let us know at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We review every report and
        correct confirmed errors as quickly as possible.
      </p>

      <h2>Contact Us</h2>
      <p>
        Questions, feedback, or press inquiries? Reach us via our{" "}
        <a href="/contact">Contact page</a> or at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. For copyright concerns, see our{" "}
        <a href="/dmca">DMCA Policy</a>.
      </p>
    </article>
  );
}
