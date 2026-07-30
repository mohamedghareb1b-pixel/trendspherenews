# TrendSphere OS — Phase 1: Core Article Engine

ده أساس المشروع الكامل. مبني بـ Clean Architecture عشان كل الميزات
اللي في الـ PRD (Newsletter, Podcast, AI Engine, Social Distribution...)
تتضاف كـ **modules مستقلة** فوق نفس الطبقات من غير ما تكسر حاجة.

## البنية

```
src/
  domain/            ← القلب. Entities + Repository Interfaces. لا يعرف شيء عن DB أو Next.js
    entities/Article.ts
    repositories/ArticleRepository.ts
  application/        ← Use Cases (منطق العمل: إنشاء مقال، نشره، جلبه...)
    use-cases/
  infrastructure/     ← التنفيذ الفعلي (Drizzle + Postgres)
    db/schema.ts
    db/client.ts
    repositories/DrizzleArticleRepository.ts
  app/                ← Next.js App Router (Presentation Layer فقط)
    page.tsx                  ← الصفحة الرئيسية
    articles/[slug]/page.tsx  ← صفحة المقال
    api/articles/route.ts     ← REST API
  lib/container.ts    ← نقطة ربط الطبقات ببعض (Dependency Injection)
```

**القاعدة الذهبية:** الاعتمادية بتتجه لجوه بس (Infrastructure → Application → Domain).
الـ Domain متعرفش حاجة عن Postgres أو Next.js. ده اللي بيخلينا نقدر نغير أي تفصيلة
تقنية من غير ما نعيد كتابة منطق العمل.

## التشغيل محليًا

```bash
npm install
cp .env.example .env   # وحط DATABASE_URL بتاعك
npm run db:generate    # يولد ملفات الهجرة
npm run db:migrate     # يطبقها على قاعدة البيانات
npm run dev
```

## إيه اللي شغال دلوقتي

### Phase 1 — Core Article Engine
- [x] Article Entity + Business Rules (publish, reading time...)
- [x] REST API: `GET /api/articles`, `POST /api/articles`
- [x] Homepage تعرض المقالات المنشورة (ISR)
- [x] صفحة مقال فردية مع SEO metadata + FAQ schema-ready
- [x] Schema لـ categories, tags, subscribers (جاهزة لكن مش متفعلة في الـ UI لسه)

### Phase 2 — Auth + Admin Dashboard
- [x] ~~NextAuth: Google + GitHub + Magic Link (Email) مع Drizzle Adapter~~ **اتبسّطت لاحقًا** (شوف التحديث تحت)
- [x] نظام صلاحيات (`admin`, `editor`, `author`, `reader`)
- [x] Middleware بيحمي `/admin/*` (لازم تكون مسجل دخول + دورك مؤهل)
- [x] لوحة تحكم: قائمة كل المقالات بكل حالاتها، إنشاء مقال، تعديله، نشره

**🔄 تحديث: تسجيل الدخول اتبسّط ليوزرنيم/باسورد بس**
بعد النقاش، Google/GitHub/Magic Link اتشالوا خالص (كانوا overkill لموقع بيديره شخص واحد).
دلوقتي تسجيل الدخول بـ `ADMIN_USERNAME` و `ADMIN_PASSWORD` من `.env` بس - غيّرهم وقتما تحب من غير ما تلمس كود.
مفيش جدول `users` بيتفحص، ومفيش Drizzle Adapter، فمفيش "أول أدمن يترفع يدويًا" - أول ما تحط اليوزر/الباسورد في `.env` تقدر تدخل `/admin` على طول.

### Phase 3 — Newsletter System (Double Opt-in)
- [x] Schema: `subscribers` (status: pending/verified/unsubscribed)
- [x] `SubscribeToNewsletterUseCase` → يبعت إيميل تأكيد بتوكن صالح 48 ساعة
- [x] `VerifySubscriptionUseCase` → يفعّل الاشتراك + يبعت إيميل ترحيب
- [x] `UnsubscribeUseCase` → إلغاء اشتراك بضغطة واحدة (GDPR-ready, رابط في كل إيميل)
- [x] API: `POST /api/newsletter/subscribe`, `GET /api/newsletter/verify`, `GET /api/newsletter/unsubscribe`
- [x] كومبوننت `<NewsletterSignup />` في الصفحة الرئيسية
- [x] `sendVerificationEmail` / `sendWelcomeEmail` عبر `EMAIL_SERVER` (nodemailer)

**ملاحظة:** لازم يكون `EMAIL_SERVER` في `.env` شغال فعليًا (SMTP حقيقي زي Resend/Mailgun/Gmail App Password) عشان الإيميلات تتبعت. من غيره الاشتراك هيفشل صامتًا عند إرسال الإيميل.

### Phase 4 — SEO Layer الكامل
- [x] `src/lib/seo.ts`: مولدات JSON-LD (NewsArticle, FAQPage, BreadcrumbList, Organization, WebSite+SearchAction)
- [x] JSON-LD محقون في صفحة المقال (Article + FAQ + Breadcrumb) والـ layout الرئيسي (Organization + Website)
- [x] Canonical URLs + Open Graph + Twitter Cards كاملة لكل مقال
- [x] `/sitemap.xml` ديناميكي (Next.js Metadata API) - بيتحدث تلقائيًا من كل مقال منشور
- [x] `/robots.txt` ديناميكي - بيسمح صراحة لزواحف الـ AI (GPTBot, ClaudeBot, PerplexityBot...) لأغراض الـ GEO
- [x] `/rss.xml` - RSS feed بآخر 50 مقال منشور

**ملاحظة:** لازم تحط `NEXT_PUBLIC_SITE_URL` في `.env` بالدومين الحقيقي بتاعك قبل الديبلوي، وإلا كل الـ canonical/sitemap/RSS هتشاور على `localhost`.

### Phase 5 — AI Content Engine
- [x] `ContentAIPort` (application layer): عقد مستقل عن أي مزود AI معين
- [x] `AnthropicContentAI` (infrastructure): تنفيذ فعلي عبر Claude API (`claude-sonnet-5`)
- [x] `GenerateArticleAIMetadataUseCase`: بياخد مقال ويولّد Meta Title/Description + AI Summary + FAQ ويحفظهم
- [x] زرار "✨ توليد SEO/FAQ بالـ AI" في صفحة تعديل المقال بلوحة التحكم
- [x] الملخص والـ FAQ المولّدين بيظهروا فورًا في نفس الصفحة (وبيتحقنوا في JSON-LD تلقائيًا لأنهم نفس حقول الـ Article)

**ملاحظة معمارية:** استخدمنا نمط Port/Adapter عشان لو حبيت تبدّل Claude بمزود تاني يوم ما (GPT, Gemini)، تكتب `infrastructure/ai/XProvider.ts` جديد يلتزم بنفس `ContentAIPort` من غير ما تلمس الـ Use Case خالص.

**ملاحظة:** الـ tags المولّدة من الـ AI (`suggestedTags`) لسه مش بتتحفظ في جدول `tags` — هيتم ربطها فعليًا في Phase 6 مع Categories/Tags UI.

**محتاج:** `ANTHROPIC_API_KEY` حقيقي في `.env` (من console.anthropic.com) عشان الزرار يشتغل.

### Phase 6 — Categories/Tags UI + Topic Hubs
- [x] `Category` + `Tag` entities, repositories (Drizzle) و use cases كاملة
- [x] لوحة تحكم: `/admin/categories` (إنشاء تصنيفات) و `/admin/tags` (عرض الوسوم)
- [x] صفحة تعديل المقال: dropdown لاختيار تصنيف + حقل وسوم (نص مفصول بفواصل)
- [x] الوسوم المولّدة من AI Content Engine (Phase 5) بتتربط تلقائيًا بالمقال (find-or-create)
- [x] **Topic Hubs عامة**: `/category/[slug]` و `/tag/[slug]` بتعرض كل المقالات المرتبطة
- [x] التصنيف والوسوم ظاهرين كـ chips قابلة للضغط في نهاية كل مقال
- [x] Sitemap اتحدث ليشمل صفحات التصنيفات والوسوم كمان
- [x] تصحيح: فلتر التصنيف في `ArticleRepository` كان بيقارن غلط (categoryId بـ categorySlug) - اتصلح لـ categoryId فعلي

### Phase 7 — Analytics Dashboard + Advertisement Platform
*(اتعملت بدل الترتيب الأصلي بناءً على طلبك - Social Distribution اتأجلت)*

**Analytics:**
- [x] تتبع داخلي خفيف بدون كوكيز (`page_views` table) - كل مشاهدة مقال بتتسجل تلقائيًا
- [x] `/admin/analytics`: إجمالي المشاهدات، متوسط يومي، رسم بياني بسيط، أفضل 10 مقالات
- [x] دعم GA4 + Microsoft Clarity + Google/Bing Search Console verification (سكريبتات بتتفعل تلقائيًا لو الـ env vars موجودة، وإلا متتحقنش خالص)

**Advertisement:**
- [x] `AdSlot` entity + جدول `ad_slots` - كل سلوت له مفتاح (key)، كود، وحالة تفعيل
- [x] `/admin/ads`: تحكم كامل في 7 أماكن إعلانية جاهزة (Homepage Hero/Feed, Article Top/Middle/Bottom, Sidebar, Footer)
- [x] كومبوننت `<AdSlot slotKey="..." />` محقون فعليًا في الصفحة الرئيسية وصفحة المقال والفوتر
- [x] الكود بيتنفذ فعليًا (بما فيه أي `<script>` جواه) عبر `AdSlotRenderer` - مش مجرد HTML خامل

**ملاحظة:** الـ Sidebar slot معمول في الـ DB والـ Admin بس لسه مش محقون في أي صفحة لأن التصميم الحالي عمود واحد بدون sidebar فعلي - لو عايز تصميم بعمودين قوللي أعمله.

**AdSense - ads.txt:**
- [x] `/ads.txt` بيتولد تلقائيًا من `ADSENSE_PUBLISHER_ID` في `.env` (لو فاضي، الملف بيرجع فاضي - محتاج تحطه قبل ما تقدّم لـ AdSense)
- كود التحقق (`adsbygoogle.js`) بتاع مرحلة التقديم يتحط في أي سلوت ظاهر في كل صفحة (الأنسب `footer`) من `/admin/ads`
- بعد القبول، كل Ad Unit code يتحط في السلوت المناسب له (`homepage_hero`, `article_top`... إلخ)

### Phase 8 — US Market Readiness
- [x] **Language**: public-facing site switched to English (`lang="en" dir="ltr"`) - homepage, article pages, category/tag hubs, sign-in, newsletter emails & result pages. *(Admin dashboard kept in Arabic intentionally - it's an internal tool. Say the word if you want it in English too.)*
- [x] **Legal pages**: `/privacy-policy`, `/terms-of-service`, `/cookie-policy`, `/dmca` - functional templates covering CCPA/CPRA, GDPR basics, AdSense disclosure, CAN-SPAM, and a DMCA takedown/counter-notice process. Linked in the footer on every page.
- [x] **Cookie Consent Banner**: shows once per browser until a choice is made. Analytics scripts (GA4, Clarity) only load *after* explicit "Accept" - not just cosmetic.
- [x] **Accessibility**: skip-to-content link, visible keyboard focus rings site-wide, associated form labels (incl. screen-reader-only labels), semantic landmarks (`header`/`main`/`footer`/`nav` with `aria-label`).
- [x] **DMCA policy page** (see Legal pages above)
- [x] Fixed a pre-existing bug: `prose` typography classes (used since Phase 1 for article/legal content) were never backed by the `@tailwindcss/typography` plugin - it's now installed and registered.

**⚠️ You must personally fill in before going live:**
- Replace placeholder emails/addresses in the legal pages (`privacy@example.com`, `legal@example.com`, `dmca@example.com`, `[Company mailing address]`)
- Set `COMPANY_MAILING_ADDRESS` in `.env` (required by the CAN-SPAM Act for marketing emails)
- **Have a lawyer review all 4 legal pages** - these are functional templates, not legal advice

**Not fully covered (flag if you need it):**
- Full WCAG audit (contrast ratios, screen-reader testing) - only structural a11y basics are in place
- EU/UK visitors technically need an IAB TCF-compliant CMP for AdSense (out of scope if you're US-only)
- Admin dashboard is still Arabic-only

### Phase 9 — Image Uploads (Supabase Storage + WebP) + Secondary Image
- [x] كل مقال بقى ليه **صورتين**: `heroImageUrl` (الرئيسية) و `secondaryImageUrl` (ثانوية) - بيظهروا جنب بعض في صفحة المقال
- [x] رفع مباشر من لوحة التحكم: تختار الصورة من جهازك، بترفع فورًا وتظهر preview
- [x] كل صورة بتتحول **WebP تلقائيًا** (عبر `sharp`) قبل الرفع - بيقلل الحجم كتير من غير فرق ملحوظ في الجودة، وبيتحدد أقصى عرض 2000px عشان محدش يرفع صورة ضخمة أوي
- [x] التخزين على **Supabase Storage** عبر `SupabaseImageStorage` (نمط Port/Adapter زي الـ AI Engine - تقدر تبدّله بـ S3 أو Cloudflare R2 لاحقًا من غير ما تلمس باقي الكود)
- [x] الصفحة الرئيسية بقت بتعرض thumbnail لكل مقال

**خطوات لازم تعملها في Supabase قبل ما تستخدم الميزة دي:**
1. من Dashboard بتاع مشروعك في Supabase → **Storage** → اعمل Bucket اسمه `article-images` (لازم يكون **Public** عشان الصور تفتح من غير توثيق)
2. من **Settings → API**: هتلاقي `SUPABASE_URL` و الـ **service_role key** (مش الـ anon key - ده بيتستخدم من السيرفر بس ومينفعش يتعرض للـ client)
3. حطهم في `.env`

**ملاحظة أمنية:** الـ upload endpoint (`/api/admin/upload-image`) محمي بجلسة أدمن - مفيش حد يقدر يرفع صور غير المسجلين دخول كـ admin/editor/author.

**ملاحظة migration:** الـ schema اتغيرت (عمود `secondary_image_url` جديد) - لازم تشغّل `npm run db:generate` و `npm run db:migrate` تاني قبل ما تشغّل المشروع.

### Phase 10 — Content & Editorial Improvements
- [x] **Quick Answer (GEO/AEO)**: حقل "المقدمة الذكية" بقى قابل للتعديل يدوي (مش بس من الـ AI) وبيظهر فعليًا لكل الزوار في صندوق مميز أعلى المقال - ده اللي بيخلي محركات زي ChatGPT/Perplexity/Google AI Overview تقتبس إجابتك مباشرة
- [x] **خطين مختلفين**: العناوين الفرعية (`h1/h2/h3/h4`) بفونت `Lora`، والفقرات بفونت `Inter` - تلقائيًا من غير أي تدخل وقت الكتابة
- [x] **القوائم والنقاط**: شغالة زي ما هي (`<ul><li>`, `<ol><li>`) - كانت موجودة من الأول بس ولا حد أكدلك عليها؛ دلوقتي فيه "دليل سريع" ظاهر تحت خانة المحتوى في لوحة التحكم يوريك الصيغة بالظبط
- [x] **FAQ يدوي**: بقى فيه محرر أسئلة/إجابات كامل (إضافة/حذف) في صفحة تعديل المقال - مش لازم تستنى الـ AI، تقدر تحطهم بنفسك أو تعدل اللي الـ AI ولّدهم
- [x] **ربط التصنيف جوه المقال**: التصنيف بقى ظاهر كرابط قريب من العنوان مباشرة (فوق) + في نهاية المقال مع الوسوم - الاتنين بيودّوا لصفحة `/category/...` اللي بتجمع كل المقالات المرتبطة
- [x] **خانة الاشتراك بالإيميل**: اتنقلت تحت (بعد قائمة المقالات) بدل ما تكون أول حاجة في الصفحة

**ملاحظة عن كتابة المحتوى:** خانة "المحتوى" لسه عبارة عن HTML خام (مفيش محرر مرئي WYSIWYG). الفونتات بتتطبق تلقائيًا حسب نوع الوسم (`<h2>` = فونت العناوين، `<p>` = فونت الفقرات) - مش محتاج تحدد الفونت بنفسك خالص، بس اكتب الوسم الصح. الدليل السريع تحت خانة المحتوى في لوحة التحكم بيوريك كل الصيغ المتاحة.

### Phase 11 — Two-Part Content Layout + Full English Admin
- [x] **المحتوى بقى جزئين**: `Content - Part 1` و `Content - Part 2` منفصلين في قاعدة البيانات (`content`, `content_part_2`) - الصورة الثانوية بتتحط تلقائيًا بينهم في صفحة المقال
- [x] ترتيب العرض النهائي في صفحة المقال: العنوان → المقدمة الذكية → **Hero Image** (فوق) → Content Part 1 → **الصورة الثانوية** (في النص) → Content Part 2 → FAQ
- [x] فورم "New Article" بقى فيه كل الحقول من أول مرة: العنوان، السلاج، المقتطف، المقدمة الذكية، الصورة الرئيسية، Content Part 1، الصورة الثانوية، Content Part 2، FAQ، التصنيف (dropdown "Choose Category")، الوسوم، Meta Title/Description - كله في خطوة واحدة، مش محتاج تدخل تعديل بعد الحفظ
- [x] **لوحة التحكم بالكامل بقت إنجليزي** (كانت عربي) - كل الصفحات، الفورمات، الأزرار، رسائل الحالة

**⚠️ SQL لازم تشغّله في Supabase** (مرة واحدة، مش هيمسح أي بيانات):
```sql
ALTER TABLE articles ADD COLUMN content_part_2 TEXT;
```
(موجود كمان في ملف `add-content-part-2.sql` المرفق، ومحدّث في `supabase-schema.sql` للتركيبات الجديدة من الصفر)

**ملاحظة صغيرة:** أسماء أماكن الإعلانات (Ad Slots) القديمة اللي كانت اتعملت تلقائيًا وانت شغال، هتفضل ظاهرة بالعربي في `/admin/ads` لحد ما تعمل slot جديد أو تحذف القديم يدويًا من قاعدة البيانات - مش حاجة مؤثرة على الوظيفة، بس تجميلية بس.

### Phase 12 — Legal Pages Cleanup (No Public Accounts)
- [x] شلنا أي إشارة لحسابات المستخدمين من الصفحات القانونية - الموقع مفيهوش تسجيل دخول للزوار خالص، بس أدمن واحد بيوزرنيم/باسورد داخلي
- [x] Privacy Policy: اتشال قسم "Account information" وقسم "Google, GitHub authentication providers"
- [x] Terms of Service: اتشال قسم "Accounts" بالكامل وأعيد ترقيم الأقسام
- [x] Cookie Policy: كوكي الجلسة اتوضح إنه للإدارة الداخلية بس مش للزوار
- [x] DMCA: اتشالت إشارة "disable/terminate user accounts" من قسم Repeat Infringers
- [x] **إيميل موحّد**: كل "Contact Us" في الصفحات الأربعة (Privacy, Terms, Cookie Policy, DMCA) بيتحكم فيه من متغير واحد `CONTACT_EMAIL` في `.env` - غيّره مكان واحد بس وهيتحدث في كل الصفحات
- [x] **عنوان الـ DMCA Designated Agent** بقى بياخد نفس `COMPANY_MAILING_ADDRESS` المستخدم في إيميلات النشرة، وحطينا العنوان الفعلي (شارع أبو دهشان، فاقوس، الشرقية، مصر)

**⚠️ لازم تحط في `.env`:**
```
CONTACT_EMAIL=your-real-email@example.com
```
لو سيبته فاضي، هيظهر `contact@example.com` مكانه في كل الصفحات - غيّره قبل ما تنشر.

### Phase 13 — About Page (E-E-A-T / AdSense requirement)
- [x] صفحة `/about` جديدة - بتغطي: المهمة، مين ورا الموقع، آلية إنتاج المحتوى (بما فيها الإفصاح الشفاف إن فيه مساعدة AI + مراجعة بشرية)، معايير تحريرية، وسياسة تصحيح الأخطاء
- [x] مضافة في الفوتر والـ sitemap

**⚠️ لازم تعدّل بنفسك (حطيت أقواس `[ ]` في الأماكن دي):**
- `[your main topics]` - المجالات اللي موقعك بيغطيها فعليًا
- `[Your Name]` و الجملة اللي بعدها - اسمك وخلفيتك الحقيقية

### Phase 14 — Contact Us Page (Real Email Delivery)
- [x] صفحة `/contact` جديدة - فورم حقيقي (اسم، إيميل، رسالة) بيبعت إيميل فعلي مش mailto بس
- [x] الإيميل بيوصل لنفس `CONTACT_EMAIL` الموحّد، وبيستخدم نفس `EMAIL_SERVER`/`EMAIL_FROM` بتوع النشرة البريدية - مفيش إعداد إضافي مطلوب
- [x] لو الإرسال فشل لأي سبب، الصفحة بتوضح إيميل بديل يتواصل بيه مباشرة
- [x] مضافة في الفوتر والـ sitemap وصفحة About

**تأكيد على سؤالك:** تسجيل الدخول (`/signin`) بقى يوزرنيم/باسورد بس من زمان - مفيش إيميل أو Magic Link فيه خالص. خانة الإيميل الوحيدة الباقية في الموقع هي الاشتراك في النشرة البريدية في الصفحة الرئيسية، وده مقصود ومنفصل تمامًا عن تسجيل الدخول.

### Phase 15 — Admin Settings, Category-Based Newsletter, Automatic Sending
**Google/Analytics Settings من الأدمن:**
- [x] `/admin/settings` - حط Google Search Console verification, Bing verification, GA4 ID, Clarity ID, AdSense Publisher ID من المتصفح مباشرة
- [x] التغييرات بتشتغل فورًا من غير أي `redeploy` - مش محتاج تلمس `.env` أو تعيد نشر المشروع تاني
- [x] لو سبت أي حقل فاضي في لوحة التحكم، بيرجع تلقائي لقيمة `.env` المقابلة (fallback) - مفيش حاجة بتتكسر

**النشرة البريدية بالتصنيف:**
- [x] الزائر بيختار التصنيفات اللي يهمه (checkboxes) وقت الاشتراك - مش هيوصله إلا محتوى التصنيفات دي بس
- [x] لازم يختار تصنيف واحد على الأقل عشان يقدر يشترك

**الإرسال التلقائي (مجاني تمامًا):**
- [x] لما تدوس "Publish Now" على أي مقال، بيتبعت أوتوماتيك إيميل لكل مشترك مؤكد (verified) مهتم بتصنيف المقال ده
- [x] بيستخدم نفس SMTP المُعد أصلاً للنشرة (`EMAIL_SERVER`) - **مفيش أي تكلفة أو خدمة إضافية**، ولا حاجة تتضبط يدوي كل مرة
- [x] الإرسال بيحصل بالتتابع (واحد واحد) مش كلهم مرة واحدة، عشان ميحصلش rate limit مع مزود الإيميل

**⚠️ SQL لازم تشغّله في Supabase:**
```sql
CREATE TABLE site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);
```
(موجود في ملف `add-site-settings-table.sql` المرفق)

**ملاحظة صريحة عن التوسع مستقبلًا:** الطريقة دي ممتازة ومجانية لحد كام مية مشترك. لو يومًا ما وصلت لآلاف المشتركين، مزود SMTP العادي (زي Resend الفري) هيبدأ يحدد عدد الإيميلات المسموح بيه يوميًا - وقتها هتحتاج تفكر في خدمة إرسال جماعي مخصصة (زي Resend Broadcast أو Mailchimp)، مش قبل كده.

## The rest of the original PRD

1. **Social Distribution**: auto-generate social posts on publish
2. **Podcast/Video system**
3. **Reader Profile**: bookmarks, reading history, preferences
4. **Internal Knowledge Graph**: auto-linking entities across articles

كل مرحلة هتتبني كـ modules جديدة جوه `application/use-cases` و
`infrastructure/` من غير ما تلمس الـ domain الحالي إلا لو فعلاً محتاجة توسعة فيه.

## ملاحظة مهمة

المشروع اتبنى هنا كـ **كود مصدري كامل جاهز للتشغيل على جهازك/سيرفرك** —
مش تم تشغيل `npm install` هنا لأن البيئة دي معزولة عن الإنترنت. لازم تشغّله
محليًا أو على Vercel/سيرفر عندك فيه اتصال بالإنترنت وبقاعدة بيانات Postgres.
