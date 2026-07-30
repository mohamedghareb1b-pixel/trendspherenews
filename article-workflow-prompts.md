# سير عمل المقال - 3 مراحل

## طريقة الاستخدام
1. انسخ **برومبت المرحلة 1** والصقه في Perplexity مع موضوع الخبر
2. خد النتيجة كاملة، وانسخها جوه **برومبت المرحلة 2** والصقه في Claude - هيطلعلك مسودة عربي
3. اقرأ المسودة وعدّل في المحتوى براحتك (نص عربي عادي، سهل تتحكم فيه)
4. لما تخلص تعديل، انسخ النسخة المعدّلة جوه **برومبت المرحلة 3** والصقه في Claude - هيترجمها إنجليزي بالـ HTML الجاهز للصق في الأدمن مباشرة

---

## المرحلة 1: برومبت Perplexity (جمع الأحداث والحقائق)

```
I need you to research the following topic/event thoroughly and give me raw,
organized research notes - NOT a written article, just structured facts I can
use to write one later.

TOPIC: [اكتب هنا الموضوع أو الحدث]

Please organize your findings under these headings:

KEY FACTS:
(chronological list of what happened - dates, numbers, names, places)

KEY PEOPLE/ENTITIES INVOLVED:
(who's involved and their role/position)

DIRECT QUOTES:
(any notable quotes, attributed to who said them and when)

STATISTICS/NUMBERS:
(any relevant figures, cited with their source)

CONTEXT/BACKGROUND:
(what led to this, relevant history)

WHAT'S STILL UNCONFIRMED OR DISPUTED:
(anything unverified, contested, or speculative - flag it clearly as such)

SOURCES:
(list every source you used with links)

Rules:
- Only include information you can attribute to a real source - do not guess
  or fill gaps with assumptions.
- If sources disagree on a fact, note the disagreement instead of picking one.
- Keep this as raw notes, not prose - I'll write the actual article myself.
```

---

## المرحلة 2: برومبت Claude (بناء مسودة عربي من نتائج البحث)

```
أنت محرر محتوى بتساعدني أجهز مسودة مقال بالعربي عشان أقرأها وأعدلها براحتي
قبل ما نترجمها بعدين للإنجليزي وننشرها.

البيانات اللي جمعتها من البحث:
[الصق هنا نتايج Perplexity كاملة]

اكتبلي مسودة منظمة بالعربي بالشكل ده بالظبط:

العنوان المبدئي:
(عنوان واضح ومباشر للمقال)

المقتطف:
(جملة أو اتنين تلخص المقال)

المقدمة الذكية (Quick Answer):
(2-3 جمل بترد على السؤال الرئيسي للموضوع مباشرة، من غير حشو)

محتوى المقال - الجزء الأول:
(مقدمة + 2-4 أقسام، كل قسم يبدأ بعنوان فرعي واضح، والفقرة اللي تحته
بالعربي الفصحى المبسطة - من غير أي علامات HTML أو تنسيق، نص عادي بس)

محتوى المقال - الجزء الثاني:
(باقي الأقسام لو الموضوع محتاج، بنفس الأسلوب - سيبه فاضي لو المقال قصير)

الأسئلة الشائعة:
(3-5 أسئلة وإجاباتها، متعلقة بالموضوع)

التصنيف المقترح:
(كلمة أو اتنين، زي: سياسة، رياضة، تكنولوجيا)

الوسوم المقترحة:
(4-6 كلمات مفتاحية بالعربي)

قواعد مهمة:
- استخدم بس المعلومات الموجودة في البيانات اللي بعتهالك، ممنوع تخترع أو
  تفترض أي حقيقة أو رقم مش موجود فيها
- لو فيه معلومة مش مؤكدة في البيانات، وضّح ده في المتن ("حسب مصادر أولية...")
- خلي أسلوب الكتابة سلس وواضح، مش رسمي جامد ومش عامية زيادة
```

---

## المرحلة 3: برومبت Claude (الترجمة للإنجليزي بالـ HTML الجاهز للأدمن)

```
اترجم المسودة العربية دي كاملة للإنجليزي، وحطها في نفس البنية اللي هيتم لصقها
مباشرة في نظام إدارة المحتوى بتاعي. اتبع الشكل ده بالظبط:

المسودة العربية (بعد ما عدّلتها):
[الصق هنا المسودة النهائية بتاعتك بعد التعديل]

المطلوب - رجّعلي بالضبط بالتنسيق ده:

TITLE:
(ترجمة العنوان - عنوان جذاب لقارئ أمريكي، تحت 70 حرف)

SLUG:
(نسخة إنجليزية من العنوان بصيغة url-friendly، حروف صغيرة وشرطات بس)

EXCERPT:
(ترجمة المقتطف، تحت 160 حرف)

QUICK_ANSWER:
(ترجمة المقدمة الذكية، بنفس المعنى بالظبط)

CONTENT (الجزء الأول):
(ترجمة كاملة لمحتوى الجزء الأول، لكن كـ HTML خام باستخدام الوسوم دي بس:
<h2> للعناوين الفرعية الرئيسية، <h3> للعناوين الأصغر لو موجودة،
<p> لكل فقرة، <ul><li> أو <ol><li> لو فيه قوائم. متكتبش <h1> خالص.
مثال على الشكل المطلوب:
<h2>Section Heading</h2>
<p>Paragraph text here...</p>)

CONTENT (الجزء الثاني):
(نفس الطريقة، لباقي المحتوى - سيبه فاضي لو مفيش جزء ثاني)

FAQ:
(كل سؤال وإجابته مترجمين، بالشكل:
Q: question
A: answer)

META_TITLE:
(تحت 60 حرف)

META_DESCRIPTION:
(تحت 155 حرف)

CATEGORY:
(ترجمة التصنيف للإنجليزي)

TAGS:
(الوسوم مترجمة، مفصولة بفاصلة)

قواعد:
- الترجمة تكون طبيعية لقارئ أمريكي، مش ترجمة حرفية كلمة بكلمة
- حافظ على كل الحقائق والأرقام والأسماء زي ما هي بالظبط من غير تغيير
- لو فيه اقتباس منقول حرفي في المسودة العربي، ترجمه بأمانة للمعنى
```

## المرحلة 4: برومبت مراجعة نهائية (لو لغتك الإنجليزي مش قوية)

افتح **محادثة جديدة تمامًا** (مش نفس المحادثة بتاعة الترجمة) والصق البرومبت ده - المحادثة الجديدة بتخلي المراجعة أدق لأنها "عين تانية" مش نفس اللي ترجم:

```
Act as a professional native English copy editor. I'll give you an article
in English that was translated from Arabic. Your only job is to check if it
reads naturally to a native English speaker - do NOT change any facts, numbers,
names, or the overall structure.

ARTICLE:
[الصق هنا الناتج الإنجليزي كامل من المرحلة 3]

Please respond in this format:

NATURAL OR NOT:
(one line: "Reads naturally" or "Needs fixes")

ISSUES FOUND:
(list any awkward phrases, unnatural word choices, or grammar issues - quote
the exact phrase and explain briefly what's wrong)

CORRECTED VERSION:
(the full article again, with all issues fixed, same HTML tags and structure)
```

انسخ الـ "CORRECTED VERSION" اللي هترجعلك، وده اللي تلصقه في الأدمن بدل النسخة الأولى.

---

## حيلتين إضافيين (من غير ما تحتاج تفهم إنجليزي خالص)

**1. الترجمة العكسية (Back-translation) - تتأكد بنفسك إن المعنى مظبوط**
خد النص الإنجليزي النهائي، حطه في Google Translate وترجمه رجوع للعربي. لو المعنى اللي رجعلك قريب من مسودتك العربية الأصلية، يبقى الترجمة سليمة. لو لقيت حاجة اتلخبطت أو اتغيرت، ده إشارة إن فيه مشكلة في الجزء ده تحديدًا.

**2. Grammarly (مجاني) - بيكتشف الأخطاء تلقائيًا من غير ما تحتاج تفهم ليه**
نزّل إضافة [Grammarly](https://www.grammarly.com/) المجانية على المتصفح، الصق النص الإنجليزي في أي حقل نص (حتى في مستند Google Docs فاضي)، وهو هيسطّر تحت أي جملة غريبة أو خطأ نحوي ويقترحلك تصحيح تضغط عليه بزرار واحد - من غير ما تحتاج تكتب حاجة بنفسك.

**الترتيب المثالي:** مرحلة 3 (ترجمة) → مرحلة 4 (مراجعة AI مستقلة) → Grammarly (تصحيح تلقائي أخير) → نشر.
