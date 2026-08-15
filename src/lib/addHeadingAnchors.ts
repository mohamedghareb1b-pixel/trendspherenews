/**
 * بيدور على كل عناوين <h2> في محتوى المقال (HTML)، ويحط لهم "id" مخفي
 * عشان نقدر نعمل روابط قفز سريع (Jump Links) ليهم.
 *
 * الاستخدام الأساسي: مقالات الـ Roundup (زي "5 حفلات في أغسطس")،
 * كل حفلة بتبدأ بـ <h2>، والدالة دي بتحول كل <h2> لهدف قفز، وبترجع
 * قايمة بالعناوين لعرضها كأزرار فوق المقال.
 *
 * محدود بـ 6 عناوين بحد أقصى (زي ما اتفقنا) - لو المقال فيه أكتر،
 * بياخد أول 6 بس ويسيب الباقي من غير زرار (المحتوى نفسه يفضل شغال عادي).
 */

export interface HeadingAnchor {
  id: string;
  text: string;
}

const MAX_ANCHORS = 6;

function slugifyHeading(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // شيل أي رموز غريبة (زي الأرقام والنقط بتفضل)
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50);
  return base ? `event-${index}-${base}` : `event-${index}`;
}

export function addHeadingAnchors(
  html: string,
  startIndex = 0
): {
  html: string;
  anchors: HeadingAnchor[];
} {
  const anchors: HeadingAnchor[] = [];
  let index = startIndex;

  const processedHtml = html.replace(
    /<h2([^>]*)>(.*?)<\/h2>/gi,
    (match, attrs, innerText) => {
      if (index >= MAX_ANCHORS) return match; // بعد أول 6 إجمالي، سيب الباقي زي ما هو من غير id

      const plainText = innerText.replace(/<[^>]+>/g, "").trim();
      if (!plainText) return match;

      index += 1;
      const id = slugifyHeading(plainText, index);
      anchors.push({ id, text: plainText });

      // لو الـ h2 أصلاً عنده attributes، نضيف الـ id من غير ما نمسحهم
      const hasIdAlready = /id\s*=/.test(attrs);
      const newAttrs = hasIdAlready ? attrs : `${attrs} id="${id}"`;

      return `<h2${newAttrs}>${innerText}</h2>`;
    }
  );

  return { html: processedHtml, anchors };
}