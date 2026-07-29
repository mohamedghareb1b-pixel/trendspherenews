import { notFound } from "next/navigation";
import { container } from "@/lib/container";
import { ImageUploadField } from "@/components/ImageUploadField";
import { FaqEditor } from "@/components/FaqEditor";
import {
  updateArticleAction,
  publishArticleAction,
  generateAIMetadataAction,
  setArticleCategoryAndTagsAction,
} from "../../actions";

interface Props {
  params: { id: string };
}

export default async function EditArticlePage({ params }: Props) {
  const article = await container.getArticleById.execute(params.id);
  if (!article) notFound();

  const [categories, currentTags] = await Promise.all([
    container.listCategories.execute(),
    container.getArticleTags.execute(article.id),
  ]);

  const boundUpdate = updateArticleAction.bind(null, article.id);
  const boundPublish = publishArticleAction.bind(null, article.id);
  const boundGenerateAI = generateAIMetadataAction.bind(null, article.id);
  const boundSetCategoryAndTags = setArticleCategoryAndTagsAction.bind(null, article.id);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Article</h1>
        <div className="flex gap-2">
          <form action={boundGenerateAI}>
            <button
              type="submit"
              className="rounded-lg border border-brand-500 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
            >
              ✨ Generate SEO/FAQ with AI
            </button>
          </form>
          {article.status !== "published" && (
            <form action={boundPublish}>
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Publish Now
              </button>
            </form>
          )}
          {article.status === "published" && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Published
            </span>
          )}
        </div>
      </div>

      {/* Category & Tags - this is what links the article to /category and /tag pages */}
      <form
        action={boundSetCategoryAndTags}
        className="space-y-3 rounded-lg border border-gray-100 p-4"
      >
        <p className="text-sm font-medium text-gray-500">Category &amp; Tags</p>
        <div>
          <label className="mb-1 block text-sm">Choose Category</label>
          <select
            name="categoryId"
            defaultValue={article.categoryId ?? ""}
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
            defaultValue={currentTags.map((t) => t.name).join(", ")}
            placeholder="AI, technology, startups"
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
        >
          Save Category &amp; Tags
        </button>
        <p className="text-xs text-gray-400">
          After saving, the category appears as a link right under the title and again at the
          end of the article, both pointing to the `/category/...` page that lists every
          article in that category.
        </p>
      </form>

      <form action={boundUpdate} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            name="title"
            defaultValue={article.title}
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Short Excerpt</label>
          <input
            name="excerpt"
            defaultValue={article.excerpt ?? ""}
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </div>

        {/* Quick Answer (GEO/AEO) */}
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
            defaultValue={article.aiSummary ?? ""}
            rows={3}
            placeholder="e.g. Bitcoin is a decentralized digital currency launched in 2009..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>

        {/* Hero image */}
        <ImageUploadField
          name="heroImageUrl"
          label="Hero Image (shown at the top of the article)"
          defaultUrl={article.heroImageUrl ?? undefined}
        />

        {/* Content part 1 */}
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
                font from paragraphs:
              </p>
              <pre className="overflow-x-auto rounded bg-white p-2">
{`<h2>A subheading</h2>
<p>The paragraph explaining this section...</p>

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
            defaultValue={article.content}
            rows={12}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
          />
        </div>

        {/* Secondary image */}
        <ImageUploadField
          name="secondaryImageUrl"
          label="Secondary Image (shown in the middle of the article)"
          defaultUrl={article.secondaryImageUrl ?? undefined}
        />

        {/* Content part 2 */}
        <div>
          <label className="mb-1 block text-sm font-medium">Content - Part 2</label>
          <p className="mb-2 text-xs text-gray-500">
            Everything that appears after the secondary image above. Leave empty if the article
            doesn&apos;t need a second part.
          </p>
          <textarea
            name="contentPart2"
            defaultValue={article.contentPart2 ?? ""}
            rows={12}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
          />
        </div>

        {/* FAQ */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Frequently Asked Questions (boosts search visibility)
          </label>
          <FaqEditor name="faq" defaultValue={article.faq} />
        </div>

        <fieldset className="rounded-lg border border-gray-100 p-4">
          <legend className="px-1 text-sm font-medium text-gray-500">SEO</legend>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm">Meta Title</label>
              <input
                name="metaTitle"
                defaultValue={article.metaTitle ?? ""}
                className="w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Meta Description</label>
              <input
                name="metaDescription"
                defaultValue={article.metaDescription ?? ""}
                className="w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          className="rounded-lg bg-brand-500 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
