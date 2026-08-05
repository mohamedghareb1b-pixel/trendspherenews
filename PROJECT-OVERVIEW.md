# TrendSphere — نظرة شاملة على المشروع

**آخر تحديث:** يوليو 2026
**الدومين:** https://trendsphere.shekss.com
**الريبو:** github.com/mohamedghareb1b-pixel/trendspherenews
**الاستضافة:** Vercel (Production, فرع main)
**قاعدة البيانات:** Supabase (PostgreSQL)

---

## 1. الفكرة الأساسية

TrendSphere موقع أخبار عالمي (بالإنجليزية) بيغطي السياسة والتكنولوجيا والثقافة،
موجّه للسوق الأمريكي بالأساس. الموقع مبني بمعمارية Clean/Layered Architecture
(Domain → Application → Infrastructure) عشان يفضل سهل التوسع والصيانة.

---

## 2. التقنيات المستخدمة (Tech Stack)

| الطبقة | التقنية |
|---|---|
| Framework | Next.js 14 (App Router) |
| اللغة | TypeScript |
| قاعدة البيانات | PostgreSQL عبر Supabase |
| ORM | Drizzle ORM |
| التصميم | Tailwind CSS + @tailwindcss/typography |
| المصادقة | NextAuth.js |
| إرسال الإيميلات | Nodemailer (SMTP، مربوط بـ Resend) |
| معالجة الصور | Sharp |
| التحقق من البيانات | Zod |
| الاستضافة | Vercel |

---

## 3. البنية المعمارية

المشروع مقسّم لـ 4 طبقات (Clean Architecture):

```
src/
├── domain/           → الكيانات الأساسية (Article, Category, Subscriber...)
├── application/       → منطق العمل (Use Cases) — كل عملية في ملف منفصل
├── infrastructure/    → التنفيذ الفعلي (قاعدة البيانات، البريد، الذكاء الاصطناعي)
└── app/                → صفحات وواجهات Next.js + API Routes
```

الميزة الأساسية لده: أي تغيير في قاعدة البيانات أو مزود البريد
منعزل تمامًا عن باقي الكود، فسهل نستبدل أي جزء من غير ما نكسر حاجة تانية.

---

## 4. الأقسام الرئيسية في الموقع

### الصفحة الرئيسية (`/`)
- عرض أحدث المقالات
- **فلتر تصنيفات تفاعلي** — يظهر فوق المقالات، يفلتر حسب القسم
- إعلانات (AdSlot) في أماكن محددة

### صفحة المقال (`/articles/[slug]`)
- محتوى المقال كامل + صور
- **زرار "Reading Mode"** — يحول الخلفية للون كريمي دافئ (Sepia) مريح للعين
- **زرار موسيقى ريلاكس** — تشغيل/إيقاف مقطوعة صوتية هادئة أثناء القراءة
- **صندوق "تابعنا"** — يظهر تلقائيًا بعد دقيقة من القراءة، بأيقونات حقيقية
  (Threads / Facebook / X / Substack) قابلة للتفعيل من الأدمن
- بيانات SEO منظمة (JSON-LD: Article + Breadcrumb + FAQ)

### لوحة التحكم (`/admin`)
محمية بتسجيل دخول (NextAuth)، وبها:
- إدارة المقالات (إنشاء / تعديل / حذف)
- إدارة التصنيفات والوسوم
- إدارة الإعلانات
- **الإعدادات العامة** (`/admin/settings`) وفيها:
  - Google Analytics 4 Measurement ID
  - Microsoft Clarity Project ID
  - Google / Bing Site Verification
  - AdSense Publisher ID
  - رابط موسيقى الخلفية
  - نص "شارة" جذابة جنب اسم الموقع في الهيدر
  - روابط السوشيال ميديا الأربعة (Threads, Facebook, X, Substack)

---

## 5. الأدوات الخارجية المربوطة وفايدتها

| الأداة | الفايدة |
|---|---|
| **Google Search Console** | تتبع ظهور الموقع في نتائج بحث جوجل، اكتشاف مشاكل الفهرسة |
| **Bing Webmaster Tools** | نفس فايدة Search Console لمحرك Bing |
| **Sitemap** (`/sitemap.xml`) | يساعد جوجل/Bing يكتشفوا المقالات الجديدة بسرعة |
| **Google Analytics 4** | إحصائيات الزوار: العدد، المصدر، المقالات الأكتر قراءة |
| **Microsoft Clarity** | تسجيلات فيديو حقيقية + خرائط حرارية لسلوك القراء |
| **Resend (عبر SMTP)** | إرسال إيميلات التحقق والإشعارات |
| **Supabase Storage** | استضافة الملفات الثابتة (زي ملف الموسيقى) |

---

## 6. البريد الإلكتروني / الاشتراك

- الاشتراك المباشر بالإيميل من الصفحة الرئيسية **اتلغى** (تم استبداله
  بنظام السوشيال ميديا المذكور فوق)
- إرسال الإيميل (لو استُخدم مستقبلًا) بيمر عبر Resend SMTP relay
- عملية الحفظ في قاعدة البيانات **منفصلة** عن عملية الإرسال — لو فشل
  الإرسال، البيانات بتفضل محفوظة ومفيش خطأ يوصل للمستخدم

---

## 7. مشاكل تقنية سابقة اتحلت (مرجع للمستقبل)

1. **فشل الـ Build بسبب Class instances**: كان بيتم تمرير Category
   entities (كلاسات) مباشرة لـ Client Component، وده ممنوع في Next.js
   14. الحل: تحويلها لـ plain objects قبل التمرير.

2. **فشل اتصال قاعدة البيانات على Vercel (شغال محليًا بس)**: السبب
   إن Supabase Connection Pooler (Transaction mode) مش بيدعم
   prepared statements. الحل: إضافة `{ prepare: false }` في
   `postgres()` client.

3. **مشاكل Git Case Sensitivity على Windows**: ملف اتحفظ بحروف صغيرة
   في الريبو (`socialFollowPrompt.tsx`) بينما الاستيراد في الكود
   بيستخدم حروف كبيرة (`SocialFollowPrompt.tsx`) — ويندوز مبيفرقش،
   لكن Vercel (Linux) بيفرّق. الحل: `git mv` عبر اسم وسيط لإجبار Git
   يسجّل التغيير.

---

## 8. خطوات لسه معلقة / أفكار مستقبلية

- [ ] ميزة "استمع للمقال" (Text-to-Speech) — تكلفتها التقديرية من
      $0.03 إلى $0.10 للمقال الواحد حسب المزود، مع كاش للصوت المولّد
      لتقليل التكلفة
- [ ] رفع محتوى فعلي لصفحات Threads / Facebook / X / Substack
- [ ] لوجو وأيقونة رسمية للموقع (البرومبتات جاهزة، محتاج تنفيذ)
- [ ] تفعيل Robots.txt والتأكد من إعداداته
- [ ] مراجعة Rich Results / Open Graph tags على أدوات فيسبوك وجوجل

---

## 9. معلومات وصول سريعة

| الحاجة | المكان |
|---|---|
| تعديل الإعدادات العامة | `trendsphere.shekss.com/admin/settings` |
| متغيرات البيئة | Vercel → Settings → Environment Variables |
| قاعدة البيانات | Supabase Dashboard → Database |
| الـ Sitemap | `trendsphere.shekss.com/sitemap.xml` |
