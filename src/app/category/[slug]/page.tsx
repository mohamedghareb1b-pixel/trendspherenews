import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { container } from "@/lib/container";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await container.getCategoryBySlug.execute(params.slug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description ?? `Latest articles in ${category.name}`,
    alternates: { canonical: `${getSiteUrl()}/category/${category.slug}` },
  };
}

export const revalidate = 60;

export default async function CategoryPage({ params }: Props) {
  const category = await container.getCategoryBySlug.execute(params.slug);
  if (!category) notFound();

  const articles = await container.getArticles.execute({ categoryId: category.id });

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: getSiteUrl() },
    { name: category.name, url: `${getSiteUrl()}/category/${category.slug}` },
  ]);

  return (
    <div className="space-y-6">
      <script {...jsonLdScriptProps(breadcrumb)} />

      <div>
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && <p className="mt-2 text-gray-600">{category.description}</p>}
      </div>

      {articles.length === 0 && (
        <p className="text-gray-500">No published articles in this category yet.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="rounded-xl border border-gray-100 p-5 transition hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">{article.title}</h2>
            {article.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{article.excerpt}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
