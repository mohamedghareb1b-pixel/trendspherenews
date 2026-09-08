import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { container } from "@/lib/container";
import { getSiteUrl, articleHref } from "@/lib/site";
import { addHeadingAnchors } from "@/lib/addHeadingAnchors";
import type { Tag } from "@/domain/entities/Tag";
import type { Article, FaqItem } from "@/domain/entities/Article";
import {
  articleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  tourEventsJsonLd,
  jsonLdScriptProps,
} from "@/lib/seo";
import { ViewTracker } from "@/components/ViewTracker";
import { AdSlot } from "@/components/AdSlot";
import { SocialFollowPrompt } from "@/components/SocialFollowPrompt";
import { ReadingModeToggle } from "@/components/ReadingModeToggle";
import { BackgroundMusicToggle } from "@/components/BackgroundMusicToggle";
import { NewsletterInlinePrompt } from "@/components/NewsletterInlinePrompt";
import { TourEventsTable } from "@/components/TourEventsTable";
import { SITE_SETTING_KEYS } from "@/application/use-cases/SiteSettingsUseCases";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await container.getArticleBySlug.execute(params.slug);
  if (!article || article.type !== "tour") return {};

  const url = `${getSiteUrl()}/tours/${article.slug}`;

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

export default async function TourArticlePage({ params }: Props) {
  const article = await container.getArticleBySlug.execute(params.slug);
  if (!article || !article.isPublished() || article.type !== "tour") notFound();

  const [tags, category, relatedArticles, explicitAuthor] = await Promise.all([
    container.getArticleTags.execute(article.id),
    article.categoryId ? container.getCategoryById.execute(article.categoryId) : null,
    container.getRelatedArticles.execute(article.id, article.categoryId, 4),
    article.authorId ? container.getAuthorById.execute(article.authorId) : null,
  ]);

  const author = explicitAuthor ?? (await container.getDefaultAuthor.execute());

  const contentPart1Anchors = addHeadingAnchors(article.content);
  const contentPart2Anchors = article.contentPart2
    ? addHeadingAnchors(article.contentPart2, contentPart1Anchors.anchors.length)
    : { html: "", anchors: [] };

  const faq = faqJsonLd(article.faq);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: getSiteUrl() },
    { name: article.title, url: `${getSiteUrl()}/tours/${article.slug}` },
  ]);
  const tourEvents = tourEventsJsonLd(article, article.tourEvents);

  const settings = await container.getSiteSettings.execute();

  return (
    <>
      <ViewTracker articleId={article.id} path={`/tours/${article.slug}`} />
      <SocialFollowPrompt
        threadsUrl={settings[SITE_SETTING_KEYS.SOCIAL_THREADS_URL]}
        facebookUrl={settings[SITE_SETTING_KEYS.SOCIAL_FACEBOOK_URL]}
        twitterUrl={settings[SITE_SETTING_KEYS.SOCIAL_TWITTER_URL]}
        substackUrl={settings[SITE_SETTING_KEYS.SOCIAL_SUBSTACK_URL]}
      />
      <script {...jsonLdScriptProps(articleJsonLd(article))} />
      <script {...jsonLdScriptProps(breadcrumb)} />
      {faq && <script {...jsonLdScriptProps(faq)} />}
      {tourEvents.map((event, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <script key={i} {...jsonLdScriptProps(event)} />
      ))}

      <article className="prose prose-lg max-w-none">
        <div className="not-prose flex flex-wrap items-center gap-2">
          <ReadingModeToggle />
          <BackgroundMusicToggle musicUrl={settings[SITE_SETTING_KEYS.BACKGROUND_MUSIC_URL]} />
        </div>
        {category && (
          <a
            href={`/category/${category.slug}`}
            className="not-prose mb-2 inline-block rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700 no-underline"
          >
            {category.name}
          </a>
        )}

        <h1 className="text-2xl leading-tight sm:text-3xl md:text-4xl">{article.title}</h1>

        {author && (
          <div className="not-prose mb-2 flex items-center gap-3">
            {author.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.avatarUrl}
                alt={author.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-sm font-semibold text-gray-800">By {author.name}</p>
              {author.bio && <p className="text-xs text-gray-500">{author.bio}</p>}
            </div>
          </div>
        )}

        {article.readingTimeMinutes && (
          <p className="text-sm text-gray-500">{article.readingTimeMinutes} min read</p>
        )}

        {article.heroImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.heroImageUrl}
            alt={article.title}
            className="not-prose w-full rounded-xl object-cover"
          />
        )}

        {article.aiSummary && (
          <div className="not-prose rounded-xl border-l-4 border-brand-500 bg-brand-50 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
              Quick Answer
            </p>
            <p className="text-gray-800">{article.aiSummary}</p>
          </div>
        )}

        <div className="not-prose">
          <AdSlot slotKey="article_top" />
        </div>

        <div dangerouslySetInnerHTML={{ __html: contentPart1Anchors.html }} />

        <h2>Tour Dates</h2>
        <TourEventsTable events={article.tourEvents} />

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
            <div dangerouslySetInnerHTML={{ __html: contentPart2Anchors.html }} />
          </>
        )}

        {article.faq.length > 0 && (
          <section>
            <h2>Frequently Asked Questions</h2>
            {article.faq.map((item: FaqItem, i: number) => (
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
          {tags.map((tag: Tag) => (
            <a
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
            >
              #{tag.name}
            </a>
          ))}
        </div>

        {relatedArticles.length > 0 && (
          <div className="not-prose mt-8 border-t border-gray-100 pt-6">
            <h2 className="mb-4 text-xl font-bold">Related Articles</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedArticles.map((rec: Article) => (
                <Link
                  key={rec.id}
                  href={articleHref(rec)}
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
