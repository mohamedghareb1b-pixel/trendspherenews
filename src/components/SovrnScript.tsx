import Script from "next/script";

/**
 * سكريبت Sovrn Commerce (المعروفة سابقًا بـ VigLink) - بيحول روابط
 * المنتجات في المقالات لروابط عمولة تلقائيًا.
 *
 * ملف منفصل بذاته (بدل ما يكون مدمج جوه AnalyticsScripts.tsx) - بيشتغل
 * دايمًا على كل صفحة، مش متوقف على موافقة الكوكيز، لأنه جزء من تحقيق
 * الدخل مش تتبع تحليلي.
 */
export function SovrnScript({ sovrnKey }: { sovrnKey?: string }) {
  if (!sovrnKey) return null;

  return (
    <Script id="sovrn-commerce" strategy="afterInteractive">
      {`
        var vglnk = {key: '${sovrnKey}'};
        (function(d, t) {
          var s = d.createElement(t); s.type = 'text/javascript'; s.async = true;
          s.src = '//cdn.viglink.com/api/vglnk.js';
          var r = d.getElementsByTagName(t)[0]; r.parentNode.insertBefore(s, r);
        }(document, 'script'));
      `}
    </Script>
  );
}
