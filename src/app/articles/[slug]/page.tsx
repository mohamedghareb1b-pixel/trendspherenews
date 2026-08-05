import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { container } from "@/lib/container";
import { getSiteUrl } from "@/lib/site";
import {
  articleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  jsonLdScriptProps,
} from "@/lib/seo";
import { ViewTracker } from "@/components/ViewTracker";
import { AdSlot } from "@/components/AdSlot";
import { SocialFollowPrompt } from "@/components/SocialFollowPrompt";
import { ReadingModeToggle } from "@/components/ReadingModeToggle";
import { BackgroundMusicToggle } from "@/components/BackgroundMusicToggle";
import { NewsletterInlinePrompt } from "@/components/NewsletterInlinePrompt";
import { SITE_SETTING_KEYS } from "@/application/use-cases/SiteSettingsUseCases";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await container.getArticleBySlug.execute(params.slug);
  if (!article) return {};

  const url = `${getSiteUrl()}/articles/${article.slug}`;

  return {
    title: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.aiSummary ?? article.excerpt ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.heroImageUrl ? [article.heroImageUrl] : undefined,
      type: "article",
      url,
      publishedTime: article.publishedAt?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.heroImageUrl ? [article.heroImageUrl] : undefined,
    },
  };
}

export const revalidate = 60;

export default async function ArticlePage({ params }: Props) {
  const article = await container.getArticleBySlug.execute(params.slug);
  if (!article || !article.isPublished()) notFound();

  const [tags, category, recentArticles] = await Promise.all([
    container.getArticleTags.execute(article.id),
    article.categoryId ? container.getCategoryById.execute(article.categoryId) : null,
    container.getArticles.execute({ limit: 3 }),
  ]);

  const recommendedArticles = recentArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

  const faq = faqJsonLd(article.faq);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: getSiteUrl() },
    { name: article.title, url: `${getSiteUrl()}/articles/${article.slug}` },
  ]);

  const settings = await container.getSiteSettings.execute();

  return (
    <>
      <ViewTracker articleId={article.id} path={`/articles/${article.slug}`} />
      <SocialFollowPrompt
        threadsUrl={settings[SITE_SETTING_KEYS.SOCIAL_THREADS_URL]}
        facebookUrl={settings[SITE_SETTING_KEYS.SOCIAL_FACEBOOK_URL]}
        twitterUrl={settings[SITE_SETTING_KEYS.SOCIAL_TWITTER_URL]}
        substackUrl={settings[SITE_SETTING_KEYS.SOCIAL_SUBSTACK_URL]}
      />
      <script {...jsonLdScriptProps(articleJsonLd(article))} />
      <script {...jsonLdScriptProps(breadcrumb)} />
      {faq && <script {...jsonLdScriptProps(faq)} />}

      <article className="prose prose-lg max-w-none">
        <ReadingModeToggle />
        <BackgroundMusicToggle musicUrl={settings[SITE_SETTING_KEYS.BACKGROUND_MUSIC_URL]} />
        {category && (
          <a
            href={`/category/${category.slug}`}
            className="not-prose mb-2 inline-block rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 no-underline"
          >
            {category.name}
          </a>
        )}

        <h1>{article.title}</h1>
        {article.readingTimeMinutes && (
          <p className="text-sm text-gray-500">{article.readingTimeMinutes} min read</p>
        )}

        {article.aiSummary && (
          <div className="not-prose rounded-xl border-l-4 border-brand-500 bg-brand-50 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
              Quick Answer
            </p>
            <p className="text-gray-800">{article.aiSummary}</p>
          </div>
        )}

        {article.heroImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.heroImageUrl}
            alt={article.title}
            className="not-prose w-full rounded-xl object-cover"
          />
        )}

        <div className="not-prose">
          <AdSlot slotKey="article_top" />
        </div>

        <div dangerouslySetInnerHTML={{ __html: article.content }} />

        {article.secondaryImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.secondaryImageUrl}
            alt={`${article.title} - illustration`}
            className="not-prose w-full rounded-xl object-cover"
          />
        )}

        <div className="not-prose">
          <AdSlot slotKey="article_middle" />
        </div>

        {article.contentPart2 && (
          <>
            <NewsletterInlinePrompt />
            <div dangerouslySetInnerHTML={{ __html: article.contentPart2 }} />
          </>
        )}

        {article.faq.length > 0 && (
          <section>
            <h2>Frequently Asked Questions</h2>
            {article.faq.map((item, i) => (
              <div key={i}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </section>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2 not-prose">
          {category && (
            <a
              href={`/category/${category.slug}`}
              className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700"
            >
              {category.name}
            </a>
          )}
          {tags.map((tag) => (
            <a
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
            >
              #{tag.name}
            </a>
          ))}
        </div>

        {recommendedArticles.length > 0 && (
          <div className="not-prose mt-8 border-t border-gray-100 pt-6">
            <h2 className="mb-4 text-xl font-bold">Recommended For You</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {recommendedArticles.map((rec) => (
                <Link
                  key={rec.id}
                  href={`/articles/${rec.slug}`}
                  className="overflow-hidden rounded-xl border border-gray-100 transition hover:shadow-md"
                >
                  {rec.heroImageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={rec.heroImageUrl}
                      alt={rec.title}
                      className="h-32 w-full object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold">{rec.title}</h3>
                    {rec.excerpt && (
                      <p className="mt-1 line-clamp-2 text-xs text-gray-600">{rec.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="not-prose">
          <AdSlot slotKey="article_bottom" />
        </div>
      </article>
    </>
  );
}