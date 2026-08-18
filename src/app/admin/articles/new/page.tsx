import { container } from "@/lib/container";
import { createArticleAction } from "../../actions";
import { ImageUploadField } from "@/components/ImageUploadField";
import { FaqEditor } from "@/components/FaqEditor";

export default async function NewArticlePage() {
  const categories = await container.listCategories.execute();

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">New Article</h1>
      <form action={createArticleAction} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            name="title"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Slug (URL)</label>
          <input
            name="slug"
            required
            placeholder="my-article-title"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Short Excerpt</label>
          <input name="excerpt" className="w-full rounded-lg border border-gray-200 px-3 py-2" />
        </div>

        {/* Hero image - shown at the very top of the article */}
        <ImageUploadField name="heroImageUrl" label="Hero Image (shown at the top of the article)" />

        {/* Content part 1 - everything before the secondary image */}
        <div>
          <label className="mb-1 block text-sm font-medium">Content - Part 1</label>
          <p className="mb-2 text-xs text-gray-500">
            Everything that appears before the secondary image below.
          </p>
          <details className="mb-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
            <summary className="cursor-pointer font-medium text-gray-700">
              Quick guide: headings, paragraphs, lists
            </summary>
            <div className="mt-2 space-y-2">
              <p>
                Content is written here as raw HTML. Headings automatically use a different
                font from paragraphs - you don&apos;t need to style anything, just use the
                right tags:
              </p>
              <pre className="overflow-x-auto rounded bg-white p-2">
{`<h2>A subheading</h2>
<p>The paragraph explaining this section...</p>

<h3>A smaller subheading</h3>
<p>Another paragraph...</p>

<ul>
  <li>First point</li>
  <li>Second point</li>
</ul>

<ol>
  <li>Step one</li>
  <li>Step two</li>
</ol>`}
              </pre>
            </div>
          </details>
          <textarea
            name="content"
            required
            rows={10}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
          />
        </div>

        {/* Ticket link (optional - for matches/events) */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Ticket Link <span className="font-normal text-gray-400">(optional - matches/events only)</span>
          </label>
          <p className="mb-2 text-xs text-gray-500">
            If filled, a ticket availability note with this link will appear automatically at the
            end of Content Part 1, right before the secondary image. Leave empty for regular
            articles.
          </p>
          <input
            type="url"
            name="ticketLink"
            placeholder="https://www.ticketnetwork.com/..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        {/* Matches schedule table (optional - for team monthly roundups) */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Matches Table <span className="font-normal text-gray-400">(optional - team schedule roundups)</span>
          </label>
          <p className="mb-2 text-xs text-gray-500">
            One match per line. Fields separated by | in this exact order:{" "}
            <code className="rounded bg-gray-100 px-1">
              Opponent | Date | Time | Venue | City | State | Status | Ticket Link (optional)
            </code>
            <br />
            Example:{" "}
            <code className="rounded bg-gray-100 px-1">
              Eagles | 2026-08-03 | 8:00 PM ET | Lincoln Financial Field | Philadelphia | PA |
              Upcoming | https://tickets.com/...
            </code>
            <br />
            If filled, a responsive table appears automatically right after Quick Answer (turns
            into stacked cards on mobile). Leave empty for regular articles.
          </p>
          <textarea
            name="matchesData"
            rows={5}
            placeholder="Eagles | 2026-08-03 | 8:00 PM ET | Lincoln Financial Field | Philadelphia | PA | Upcoming | https://tickets.com/..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-xs"
          />
        </div>

        {/* Secondary image - shown in the middle of the article, between the two content parts */}
        <ImageUploadField
          name="secondaryImageUrl"
          label="Secondary Image (shown in the middle of the article)"
        />

        {/* Content part 2 - everything after the secondary image */}
        <div>
          <label className="mb-1 block text-sm font-medium">Content - Part 2</label>
          <p className="mb-2 text-xs text-gray-500">
            Everything that appears after the secondary image above. Leave empty if the article
            doesn&apos;t need a second part.
          </p>
          <textarea
            name="contentPart2"
            rows={10}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
          />
        </div>

        {/* Quick Answer - GEO/AEO */}
        <div className="rounded-lg border border-brand-100 bg-brand-50 p-4">
          <label className="mb-1 block text-sm font-medium text-brand-700">
            Quick Answer (GEO/AEO summary)
          </label>
          <p className="mb-2 text-xs text-gray-500">
            2-3 sentences that directly answer the article&apos;s main question. Shown to every
            visitor in a highlighted box at the top of the article, and helps AI answer engines
            (ChatGPT, Perplexity, Google AI Overview) quote your content directly.
          </p>
          <textarea
            name="aiSummary"
            rows={3}
            placeholder="e.g. Bitcoin is a decentralized digital currency launched in 2009..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        {/* FAQ */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Frequently Asked Questions (boosts search visibility)
          </label>
          <FaqEditor name="faq" defaultValue={[]} />
        </div>

        {/* Category + Tags */}
        <div className="space-y-3 rounded-lg border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-500">Category &amp; Tags</p>
          <div>
            <label className="mb-1 block text-sm">Choose Category</label>
            <select
              name="categoryId"
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="mt-1 text-xs text-amber-600">
                No categories yet - create one from the{" "}
                <a href="/admin/categories" className="underline">
                  Categories
                </a>{" "}
                page first.
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm">Tags (comma-separated)</label>
            <input
              name="tags"
              placeholder="AI, technology, startups"
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>
        </div>

        {/* SEO */}
        <fieldset className="rounded-lg border border-gray-100 p-4">
          <legend className="px-1 text-sm font-medium text-gray-500">SEO</legend>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm">Meta Title</label>
              <input
                name="metaTitle"
                className="w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Meta Description</label>
              <input
                name="metaDescription"
                className="w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          className="rounded-lg bg-brand-500 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
        >
          Save as Draft
        </button>
      </form>
    </div>
  );
}
