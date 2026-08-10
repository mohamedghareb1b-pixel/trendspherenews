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
  return {
    title: `#${params.slug}`,
    alternates: { canonical: `${getSiteUrl()}/tag/${params.slug}` },
    // التاجات بتتولد أوتوماتيك بالـ AI، فممكن يكون فيه تكرار كبير في المحتوى
    // بين صفحات التاجات المختلفة - noindex بيمنع جوجل يفهرسها كمحتوى مكرر،
    // مع إن الصفحة تفضل شغالة وقابلة للتصفح عاديًا للزوار
    robots: { index: false, follow: true },
  };
}

export const revalidate = 60;

export default async function TagPage({ params }: Props) {
  const articles = await container.getArticlesByTag.execute(params.slug);
  if (articles.length === 0) {
    // The tag may exist without any published articles yet - show empty state instead of a hard 404
  }

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: getSiteUrl() },
    { name: `#${params.slug}`, url: `${getSiteUrl()}/tag/${params.slug}` },
  ]);

  return (
    <div className="space-y-6">
      <script {...jsonLdScriptProps(breadcrumb)} />

      <h1 className="text-3xl font-bold">#{params.slug}</h1>

      {articles.length === 0 && (
        <p className="text-gray-500">No published articles with this tag yet.</p>
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