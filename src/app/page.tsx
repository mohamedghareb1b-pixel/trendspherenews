import Link from "next/link";
import { container } from "@/lib/container";
import { AdSlot } from "@/components/AdSlot";

export const revalidate = 60; // ISR - refreshes every minute

interface HomePageProps {
  searchParams: { category?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const selectedCategory = searchParams.category;

  const [articles, categories] = await Promise.all([
    container.getArticles.execute(
      selectedCategory ? { categoryId: selectedCategory } : {}
    ),
    container.listCategories.execute(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Latest Articles</h1>

      <AdSlot slotKey="homepage_hero" />

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              !selectedCategory
                ? "bg-brand-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/?category=${c.id}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                selectedCategory === c.id
                  ? "bg-brand-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

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
    </div>
  );
}
