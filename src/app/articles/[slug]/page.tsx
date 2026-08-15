import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { container } from "@/lib/container";
import { getSiteUrl } from "@/lib/site";
import { addHeadingAnchors } from "@/lib/addHeadingAnchors";
import type { Tag } from "@/domain/entities/Tag";
import type { Article, FaqItem } from "@/domain/entities/Article";
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

  const [tags, category, relatedArticles, explicitAuthor] = await Promise.all([
    container.getArticleTags.execute(article.id),
    article.categoryId ? container.getCategoryById.execute(article.categoryId) : null,
    container.getRelatedArticles.execute(article.id, article.categoryId, 4),
    article.authorId ? container.getAuthorById.execute(article.authorId) : null,
  ]);

  // لو المقال ملوش author محدد صراحة، بنستخدم الكاتب الافتراضي للموقع (Shindy)
  const author = explicitAuthor ?? (await container.getDefaultAuthor.execute());

  const recommendedArticles = relatedArticles;

  // بنحلل الجزء الأول والتاني مع بعض، عشان أزرار القفز السريع تشمل
  // كل الحفلات/الأقسام في المقال، مش الجزء الأول بس
  const contentPart1Anchors = addHeadingAnchors(article.content);
  const contentPart2Anchors = article.contentPart2
    ? addHeadingAnchors(article.contentPart2, contentPart1Anchors.anchors.length)
    : { html: "", anchors: [] };

  const contentAnchors = {
    part1Html: contentPart1Anchors.html,
    part2Html: contentPart2Anchors.html,
    anchors: [...contentPart1Anchors.anchors, ...contentPart2Anchors.anchors],
  };

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

        {/* أزرار القفز السريع - بتظهر تلقائيًا بس لو المقال فيه أكتر من عنوان
            فرعي واحد (زي مقالات الـ Roundup اللي فيها كذا حفلة/مناسبة) */}
        {contentAnchors.anchors.length > 1 && (
          <nav className="not-prose flex flex-wrap gap-2 rounded-xl border border-gray-100 bg-gray-50 p-3">
            {contentAnchors.anchors.map((anchor, i) => (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-brand-700 shadow-sm ring-1 ring-gray-200 hover:bg-brand-50"
              >
                {i + 1}. {anchor.text}
              </a>
            ))}
          </nav>
        )}

        <div dangerouslySetInnerHTML={{ __html: contentAnchors.part1Html }} />

        {article.ticketLink && (
          <p className="not-prose text-gray-700">
            Still looking for tickets? Check current ticket availability{" "}
            <a
              href={article.ticketLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="font-semibold text-base underline decoration-2 underline-offset-2 text-brand-700 hover:text-brand-900"
            >
              here
            </a>{" "}
            on TicketNetwork. Resale tickets may still be available even when standard tickets
            are sold out, although resale prices can be higher than face value.
          </p>
        )}

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
            <div dangerouslySetInnerHTML={{ __html: contentAnchors.part2Html }} />
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

        {recommendedArticles.length > 0 && (
          <div className="not-prose mt-8 border-t border-gray-100 pt-6">
            <h2 className="mb-4 text-xl font-bold">Related Articles</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {recommendedArticles.map((rec: Article) => (
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