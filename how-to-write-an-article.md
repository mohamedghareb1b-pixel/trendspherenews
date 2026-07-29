# دليل كتابة مقال في TrendSphere - بالترتيب + مثال كامل

## 1) ترتيب الفورم بالظبط (`/admin/articles/new`)

1. **Title** - عنوان المقال
2. **Slug** - رابط المقال (بالإنجليزي، حروف صغيرة، شرطات بدل مسافات)
3. **Short Excerpt** - جملة أو اتنين بتظهر في كارد المقال بالصفحة الرئيسية
4. **Hero Image** - الصورة اللي هتظهر فوق المقال خالص
5. **Content - Part 1** - أول نص المقال
6. **Secondary Image** - الصورة اللي هتظهر في نص المقال، بين الجزء الأول والتاني
7. **Content - Part 2** - باقي المقال (ممكن تسيبه فاضي لو المقال قصير ومحتاجش تقسيم)
8. **Quick Answer** - إجابة مختصرة (2-3 جمل) بتظهر في صندوق مميز فوق المقال
9. **FAQ** - أسئلة وإجابات (تقدر تضيف براحتك)
10. **Category** - تختاره من قائمة منسدلة (لازم تكون عملته الأول من `/admin/categories`)
11. **Tags** - كلمات مفتاحية مفصولة بفاصلة
12. **Meta Title / Meta Description** - للـ SEO

---

## 2) طريقة كتابة المحتوى (Part 1 و Part 2)

المحتوى بيتكتب كـ **HTML خام** - مش Markdown ومش Word. الوسوم اللي تحتاجها بس:

| الوسم | استخدامه |
|---|---|
| `<h2>عنوان فرعي</h2>` | عنوان قسم رئيسي - بيظهر بفونت مختلف تلقائيًا |
| `<h3>عنوان أصغر</h3>` | عنوان فرعي جوه القسم |
| `<p>فقرة نص عادي</p>` | أي فقرة نص |
| `<ul><li>...</li></ul>` | قائمة نقطية |
| `<ol><li>...</li></ol>` | قائمة مرقّمة |
| `<strong>نص غامق</strong>` | تغميق كلمة |

**مهم:** متكتبش `<h1>` خالص - العنوان بيتضاف تلقائيًا من خانة Title.

---

## 3) مثال كامل - مقال حقيقي من الألف للياء

**Title:**
```
7 Simple Habits That Can Improve Your Sleep Quality Tonight
```

**Slug:**
```
improve-sleep-quality-habits
```

**Short Excerpt:**
```
Struggling to fall asleep or stay asleep? These seven science-backed habits can help you sleep better starting tonight.
```

**Hero Image:** (صورة لغرفة نوم هادية أو حد نايم مرتاح - تدور عليها في Unsplash/Pexels وترفعها)

**Content - Part 1:**
```html
<p>Getting a good night's sleep affects everything from your mood to your immune system, yet millions of people struggle with it every night. The good news is that small, consistent changes to your routine can make a real difference.</p>

<h2>1. Stick to a Consistent Sleep Schedule</h2>
<p>Going to bed and waking up at the same time every day - even on weekends - helps regulate your body's internal clock, making it easier to fall asleep and wake up naturally.</p>

<h2>2. Limit Screen Time Before Bed</h2>
<p>The blue light from phones and laptops can suppress melatonin, the hormone that makes you feel sleepy. Try to put screens away at least 30 minutes before bedtime.</p>

<h2>3. Watch What You Eat and Drink</h2>
<p>Caffeine and heavy meals close to bedtime can disrupt your sleep. Here's what to keep in mind:</p>
<ul>
  <li>Avoid caffeine after 2 PM</li>
  <li>Skip large meals within 2-3 hours of bedtime</li>
  <li>Limit alcohol, which disrupts deep sleep</li>
</ul>
```

**Secondary Image:** (صورة لكوباية شاي أو غرفة نوم مظلمة - زاوية تانية عن الصورة الرئيسية)

**Content - Part 2:**
```html
<h2>4. Create a Relaxing Bedtime Routine</h2>
<p>A consistent wind-down routine signals to your brain that it's time to sleep. This could be reading, light stretching, or listening to calm music.</p>

<h2>5. Optimize Your Bedroom Environment</h2>
<p>Your bedroom should be cool, dark, and quiet. Consider these simple steps:</p>
<ol>
  <li>Keep the room temperature between 60-67°F (15-19°C)</li>
  <li>Use blackout curtains or an eye mask</li>
  <li>Try a white noise machine if outside noise is an issue</li>
</ol>

<h2>6. Get Natural Light During the Day</h2>
<p>Exposure to sunlight, especially in the morning, helps regulate your sleep-wake cycle and improves sleep quality at night.</p>

<h2>7. Manage Stress Before Bed</h2>
<p>Racing thoughts are one of the most common reasons people can't fall asleep. Journaling for five minutes before bed can help clear your mind.</p>

<p>Improving sleep quality doesn't require a complete lifestyle overhaul. Start with one or two of these habits, stay consistent, and you should start noticing a difference within a couple of weeks.</p>
```

**Quick Answer:**
```
The most effective ways to improve sleep quality include keeping a consistent sleep schedule, avoiding screens before bed, limiting caffeine after 2 PM, and keeping your bedroom cool, dark, and quiet.
```

**FAQ:**
```
Q: How long does it take to see results from better sleep habits?
A: Most people notice improvements within 1-2 weeks of consistently following better sleep habits, though full adjustment of your internal clock can take up to a month.

Q: Is it bad to nap during the day if I'm not sleeping well at night?
A: Short naps (20-30 minutes) earlier in the day are generally fine, but long or late naps can make it harder to fall asleep at night.

Q: What temperature is best for sleeping?
A: Most sleep experts recommend keeping your bedroom between 60-67°F (15-19°C) for optimal sleep quality.
```

**Category:**
```
Health
```

**Tags:**
```
sleep, health, wellness, sleep tips
```

**Meta Title:**
```
7 Habits to Improve Sleep Quality Tonight
```

**Meta Description:**
```
Discover 7 simple, science-backed habits that can help you fall asleep faster and sleep better - starting tonight.
```

---

## خلاصة سريعة

- Part 1 وPart 2 بس **تقسيم شكلي مكاني** عشان الصورة الثانوية تتحط في النص - مش لازم يكون فيه منطق معين إنك تقسم عندها، بس بصريًا هي نص المقال مقسوم نصين
- لو المقال قصير أو مش عايز صورة في النص، سيب **Secondary Image** و **Content - Part 2** فاضيين، والمقال هيتعرض عادي من غير مشكلة
- بعد ما تحفظ، المقال بيبقى "Draft" - لازم تدخل عليه من `/admin` وتدوس **"Publish Now"** عشان يظهر للزوار
