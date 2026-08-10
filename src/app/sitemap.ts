import type { MetadataRoute } from "next";
import { container } from "@/lib/container";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 300; // يتحدث كل 5 دقايق بدل ساعة - عشان المقالات الجديدة تتفهرس أسرع

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site, changeFrequency: "hourly", priority: 1 },
    { url: `${site}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site}/terms-of-service`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site}/cookie-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${site}/dmca`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const [articles, categories] = await Promise.all([
    container.getArticles.execute({ limit: 5000 }),
    container.listCategories.execute(),
  ]);

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${site}/articles/${article.slug}`,
    ...(article.updatedAt ? { lastModified: new Date(article.updatedAt) } : {}),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${site}/category/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  // صفحات التاجات اتشالت من الـ sitemap عمدًا - بقت noindex لأنها بتتولد أوتوماتيك
  // بالـ AI ومحتواها متكرر مع صفحات التصنيفات، فمفيش داعي نبعتها لجوجل أصلاً

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes];
}