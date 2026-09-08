export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000"
  );
}

export const SITE_NAME = "Shekss";

/** بيرجع الرابط الصح للمقال حسب نوعه: /tours/slug لمقالات "ارتيكل 2"، و/articles/slug للباقي */
export function articleHref(article: { type?: string; slug: string }): string {
  return article.type === "tour" ? `/tours/${article.slug}` : `/articles/${article.slug}`;
}
