import Link from "next/link";
import { container } from "@/lib/container";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { AdSlot } from "@/components/AdSlot";

export const revalidate = 60; // ISR - refreshes every minute

export default async function HomePage() {
  const [articles, categories] = await Promise.all([
    container.getArticles.execute(),
    container.listCategories.execute(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Latest Articles</h1>

      <AdSlot slotKey="homepage_hero" />

      {articles.length === 0 && (
        <p className="text-gray-500">
          No published articles yet. Create your first one via API: POST /api/articles
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="overflow-hidden rounded-xl border border-gray-100 transition hover:shadow-md"
          >
            {article.heroImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.heroImageUrl}
                alt={article.title}
                className="h-40 w-full object-cover"
              />
            )}
            <div className="p-5">
              <h2 className="text-lg font-semibold">{article.title}</h2>
              {article.excerpt && (
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">{article.excerpt}</p>
              )}
              {article.readingTimeMinutes && (
                <span className="mt-3 block text-xs text-gray-400">
                  {article.readingTimeMinutes} min read
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <AdSlot slotKey="homepage_feed" />

      <NewsletterSignup categories={categories} />
    </div>
  );
}
