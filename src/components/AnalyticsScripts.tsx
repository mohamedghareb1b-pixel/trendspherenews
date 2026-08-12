"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, ConsentValue, getStoredConsent } from "@/lib/consent";

/**
 * السكريبتات دي (GA4, Clarity) مش بتتحمل خالص لحد ما المستخدم يوافق
 * على الكوكيز غير الأساسية من الـ Cookie Consent banner.
 * الـ IDs بتيجي كـ props من الـ layout (اللي بيجيبهم من لوحة التحكم/قاعدة
 * البيانات) بدل ما تتقرا من env مباشرة - يعني تقدر تغيّرهم من /admin/settings
 * من غير ما تحتاج تعمل redeploy للمشروع.
 */
export function AnalyticsScripts({
  gaId,
  clarityId,
  sovrnKey,
}: {
  gaId?: string;
  clarityId?: string;
  sovrnKey?: string;
}) {
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(getStoredConsent());

    function handleChange(e: Event) {
      setConsent((e as CustomEvent<ConsentValue>).detail);
    }

    window.addEventListener(CONSENT_EVENT, handleChange);
    return () => window.removeEventListener(CONSENT_EVENT, handleChange);
  }, []);

  return (
    <>
      {/* سكريبت Sovrn Commerce (تحويل روابط المنتجات لروابط عمولة) -
          بيشتغل دايمًا على كل صفحة، مش متوقف على موافقة الكوكيز زي GA/Clarity،
          لأنه جزء من تحقيق الدخل مش تتبع تحليلي، وSovrn نفسها بتطلب وجوده
          في كل صفحة عشان الموقع يفضل مؤهل للمراجعة والدفع */}
      {sovrnKey && (
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
      )}

      {consent === "granted" && (
        <>
          {gaId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
              <Script id="ga4-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `}
              </Script>
            </>
          )}

          {clarityId && (
            <Script id="clarity-init" strategy="afterInteractive">
              {`
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityId}");
              `}
            </Script>
          )}
        </>
      )}
    </>
  );
}
