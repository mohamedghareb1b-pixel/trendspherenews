import { container } from "@/lib/container";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

export const revalidate = 3600;

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const site = getSiteUrl();
  const articles = await container.getArticles.execute({ limit: 50 });

  const items = articles
    .map(
      (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${site}/articles/${article.slug}</link>
      <guid isPermaLink="true">${site}/articles/${article.slug}</guid>
      <description>${escapeXml(article.excerpt ?? "")}</description>
      <pubDate>${(article.publishedAt ?? article.createdAt).toUTCString()}</pubDate>
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${site}</link>
    <description>أحدث المقالات من ${SITE_NAME}</description>
    <language>ar</language>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
