import { Article, TourEvent } from "@/domain/entities/Article";
import { articleHref, getSiteUrl, SITE_NAME } from "./site";

/**
 * كل الدوال دي بترجع كائن JSON-LD جاهز للحقن في <script type="application/ld+json">.
 * مبنية بمعزل عن أي React component عشان تتستخدم في أي مكان (صفحات، RSS، إلخ).
 */

export function organizationJsonLd() {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: site,
    logo: `${site}/logo.png`,
  };
}

export function websiteJsonLd() {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: site,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  if (faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleJsonLd(article: Article, authorName?: string) {
  const site = getSiteUrl();
  const url = `${site}${articleHref(article)}`;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt ?? article.metaDescription ?? undefined,
    image: article.heroImageUrl ? [article.heroImageUrl] : undefined,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: authorName
      ? { "@type": "Person", name: authorName }
      : { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${site}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "article"],
    },
  };
}

/**
 * بيرجع Event JSON-LD لكل حفلة لسه ما فاتتش في مقال "ارتيكل 2" - ده اللي بيخلي
 * جوجل ومحركات الذكاء الاصطناعي (وتحسين البحث الصوتي) يفهموا كل حفلة كـ "Event"
 * حقيقي بتاريخ ومكان ورابط تذاكر. الحفلات اللي فاتت متتضافش عشان منديش إشارة
 * غلط إن فيه حفلة قايمة وهي خلصت.
 */
export function tourEventsJsonLd(article: Article, events: TourEvent[]) {
  const site = getSiteUrl();
  const url = `${site}/tours/${article.slug}`;
  const now = Date.now();

  return events
    .filter((event) => {
      const dt = new Date(`${event.date}T${event.time || "23:59"}`);
      return !Number.isNaN(dt.getTime()) && dt.getTime() >= now;
    })
    .map((event) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: article.title,
      startDate: `${event.date}T${event.time || "19:00"}:00`,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: event.venue,
        address: {
          "@type": "PostalAddress",
          addressLocality: event.city,
          addressRegion: event.state,
          addressCountry: "US",
        },
      },
      image: article.heroImageUrl ? [article.heroImageUrl] : undefined,
      offers: event.ticketLink
        ? {
            "@type": "Offer",
            url: event.ticketLink,
            availability: "https://schema.org/InStock",
          }
        : undefined,
      url,
    }));
}

/** يحول أي JSON-LD object لـ props جاهزة للحقن في <script> */
export function jsonLdScriptProps(data: unknown) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}
