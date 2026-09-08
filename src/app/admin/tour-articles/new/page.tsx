import { container } from "@/lib/container";
import { createTourArticleAction } from "../../actions";
import { ImageUploadField } from "@/components/ImageUploadField";
import { FaqEditor } from "@/components/FaqEditor";
import { TourEventsEditor } from "@/components/TourEventsEditor";

export default async function NewTourArticlePage() {
  const categories = await container.listCategories.execute();

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold">New Tour Article</h1>
        <p className="mt-1 text-sm text-gray-500">
          "Article 2" - for a full month-long tour/event schedule for one artist. This publishes
          to its own page at <code>/tours/slug</code>, but still shows up on the homepage and
          category pages next to regular articles.
        </p>
      </div>

      <form action={createTourArticleAction} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            name="title"
            required
            placeholder="e.g. Artist Name - Full US Tour Dates (September 2026)"
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Slug (URL)</label>
          <input
            name="slug"
            required
            placeholder="artist-name-tour-dates-september-2026"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
          />
          <p className="mt-1 text-xs text-gray-400">
            Will be published at yoursite.com/tours/this-slug
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Short Excerpt</label>
          <input name="excerpt" className="w-full rounded-lg border border-gray-200 px-3 py-2" />
        </div>

        {/* Hero image */}
        <ImageUploadField name="heroImageUrl" label="Hero Image (shown at the top of the article)" />

        {/* Intro content */}
        <div>
          <label className="mb-1 block text-sm font-medium">Intro Content</label>
          <p className="mb-2 text-xs text-gray-500">
            Written as raw HTML. This appears above the tour dates table below.
          </p>
          <textarea
            name="content"
            required
            rows={8}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
          />
        </div>

        {/* Tour dates table */}
        <div className="rounded-lg border border-brand-100 bg-brand-50 p-4">
          <label className="mb-1 block text-sm font-medium text-brand-700">Tour Dates</label>
          <p className="mb-3 text-xs text-gray-600">
            Add one row per show. Once a show's date and time have passed, it will automatically
            show as "Ended" on the public page instead of the ticket button - nothing needs to be
            removed manually.
          </p>
          <TourEventsEditor name="tourEvents" defaultValue={[]} />
        </div>

        {/* Secondary image */}
        <ImageUploadField
          name="secondaryImageUrl"
          label="Secondary Image (shown after the tour dates table)"
        />

        {/* Content part 2 */}
        <div>
          <label className="mb-1 block text-sm font-medium">Additional Content (optional)</label>
          <p className="mb-2 text-xs text-gray-500">
            Everything here appears after the secondary image above.
          </p>
          <textarea
            name="contentPart2"
            rows={8}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
          />
        </div>

        {/* Quick Answer - GEO/AEO */}
        <div className="rounded-lg border border-brand-100 bg-brand-50 p-4">
          <label className="mb-1 block text-sm font-medium text-brand-700">
            Quick Answer (GEO/AEO summary)
          </label>
          <p className="mb-2 text-xs text-gray-500">
            2-3 sentences that directly answer "when and where is [artist] touring". Shown in a
            highlighted box at the top of the page and helps AI answer engines and voice search
            quote it directly.
          </p>
          <textarea
            name="aiSummary"
            rows={3}
            placeholder="e.g. Artist Name is touring the US throughout September 2026, with stops in..."
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
          </div>
          <div>
            <label className="mb-1 block text-sm">Tags (comma-separated)</label>
            <input
              name="tags"
              placeholder="concerts, tour dates, pop"
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
