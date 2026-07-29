# TrendSphere Article Generator Prompt

## طريقة الاستخدام
انسخ البرومبت اللي تحت كامل، الصقه في أي أداة AI (ChatGPT, Claude, Gemini...)،
استبدل `[TOPIC]` بموضوع المقال اللي عايزه، وابعته. هيطلعلك كل حاجة منظمة تحت
عناوين واضحة تقدر تنسخها كل واحدة في مكانها في لوحة التحكم مباشرة.

---

## البرومبت (انسخ من هنا لحد آخر السطر)

```
You are an expert content writer and SEO/GEO strategist writing for a US-based
content publishing platform. Write a complete, publish-ready article about:

TOPIC: [TOPIC]

Target audience: general US readers interested in this topic
Tone: clear, informative, conversational — not overly formal, no fluff
Length: 1200-1800 words

Return your answer using EXACTLY this structure, with these exact labels in
all caps followed by a colon, so it can be copy-pasted directly into a CMS.
Do not add any extra commentary before or after.

TITLE:
(a compelling, SEO-friendly headline, under 70 characters)

SLUG:
(url-friendly-slug-like-this, lowercase, hyphens only, no special characters)

EXCERPT:
(1-2 sentence teaser, under 160 characters, shown in article preview cards)

QUICK_ANSWER:
(2-3 sentences that directly and completely answer the main question of this
article, written so an AI assistant like ChatGPT, Perplexity, or a Google AI
Overview could quote it as a standalone answer. No fluff, no "in this article
we will discuss" — just the actual answer.)

CONTENT:
(Full article body as raw HTML using ONLY these tags: <h2>, <h3>, <p>, <ul>
with <li>, <ol> with <li>, <strong>, <a href="">. Structure it like this:
- Start with 1-2 intro paragraphs, no heading before them
- Break the rest into 4-7 sections, each starting with an <h2> heading
- Use <h3> for sub-points inside a section only if needed
- Use bullet or numbered lists wherever you list 3 or more items
- Do NOT include the article title as an <h1> - it is added automatically
- Do NOT insert any <img> tags - images are added separately
- End with a short concluding paragraph, no "Conclusion" heading needed
- Do not use Markdown syntax like ** or # anywhere - HTML tags only)

FAQ:
(Exactly 4-5 question/answer pairs relevant to the topic, in this format:
Q: question here
A: answer here, 2-3 sentences
Q: next question
A: next answer
...)

META_TITLE:
(under 60 characters, can differ slightly from TITLE, optimized for search)

META_DESCRIPTION:
(under 155 characters, includes the main benefit or a soft call to action)

CATEGORY:
(one broad category this article belongs to, e.g. Technology, Health, Finance,
Travel, Business - pick the single best fit)

TAGS:
(4-6 comma-separated keywords relevant to the topic, lowercase)

HERO_IMAGE_SEARCH:
(a short, specific search query to find a fitting hero/cover image on a stock
photo site, e.g. "person using laptop in modern office")

SECONDARY_IMAGE_SEARCH:
(a different, complementary search query for a second image - should show a
different angle or detail related to the topic than the hero image)

Rules:
- Do not fabricate specific statistics, studies, or named sources. Keep any
  factual claims general and well-established, or phrase them as
  "many experts suggest" / "industry estimates show" instead of citing a
  specific number you cannot verify.
- Write in natural, fluent English for a US audience.
- Do not repeat the TITLE verbatim inside CONTENT.
```

---

## فين تحط كل جزء في لوحة التحكم (`/admin/articles/new`)

| الجزء اللي هيطلع | تحطه فين |
|---|---|
| `TITLE` | خانة "العنوان" |
| `SLUG` | خانة "الرابط (slug)" |
| `EXCERPT` | خانة "مقتطف قصير" |
| `QUICK_ANSWER` | خانة "المقدمة الذكية" (بعد ما تحفظ المقال أول مرة وتفتحه للتعديل) |
| `CONTENT` | خانة "المحتوى" - انسخه زي ما هو بالظبط (هو أصلاً HTML) |
| `FAQ` | كل سؤال/إجابة تحطهم في محرر الـ FAQ (زرار "+ إضافة سؤال") - في صفحة التعديل بعد الحفظ الأول |
| `META_TITLE` / `META_DESCRIPTION` | خانتين الـ SEO في الآخر - في صفحة التعديل |
| `CATEGORY` | لو التصنيف ده مش موجود، اعمله الأول من `/admin/categories`، وبعدين اختاره من الـ dropdown في صفحة تعديل المقال |
| `TAGS` | خانة "الوسوم" في صفحة تعديل المقال - افصل بينهم بفاصلة زي ما هما |
| `HERO_IMAGE_SEARCH` / `SECONDARY_IMAGE_SEARCH` | مش بتتحط في حتة - دول اقتراحات تدور بيهم على صور مناسبة (Unsplash, Pexels) وترفعها من نفس صفحة تعديل المقال |

**ملحوظة:** المقال بيتحفظ أول مرة كـ "مسودة" بحقول أساسية بس (العنوان، السلاج، المقتطف،
المحتوى، الصور). بعد الحفظ، تفتحه تاني للتعديل وتكمل باقي الحقول (المقدمة الذكية، FAQ،
SEO، التصنيف، الوسوم) - كلهم موجودين في نفس صفحة "تعديل المقال".
