"use client";

import { useEffect, useRef, useState } from "react";
import { NewsletterSignup } from "@/components/NewsletterSignup";

// مفاتيح localStorage - محفوظة على متصفح الزائر بس (مفيش تسجيل دخول للزوار في الموقع)
const SUBSCRIBED_KEY = "ts_newsletter_subscribed";
const DISMISSED_AT_KEY = "ts_newsletter_dismissed_at";
const DISMISS_COOLDOWN_DAYS = 7; // بعد قفله بالـ X، هيرجع يظهر تاني بعد الفترة دي

/**
 * غلاف حوالين NewsletterSignup - بيظهره بس لما القارئ فعليًا يوصل
 * للنقطة دي في الصفحة (عن طريق IntersectionObserver)، مش ثابت من الأول.
 * وفيه زرار X يقفله لو القارئ مش عايزه.
 *
 * مبيظهرش خالص لو الزائر:
 * - سجل إيميله قبل كده من نفس المتصفح (SUBSCRIBED_KEY)
 * - أو قفله بالـ X قبل كده ولسه في فترة الـ cooldown (DISMISSED_AT_KEY)
 *   - بعد {DISMISS_COOLDOWN_DAYS} أيام من القفل، هيرجع يظهر تاني تلقائيًا
 *
 * ملاحظة: ده تخزين محلي على متصفح الزائر بس - لو فتح من جهاز/متصفح تاني هيظهرله تاني،
 * لأن الموقع مفيهوش حسابات زوار نربط بيها الحالة دي بين الأجهزة.
 */
export function NewsletterInlinePrompt() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(true); // true لحد ما نتأكد من localStorage

  useEffect(() => {
    // نتأكد الأول لو الزائر سجل قبل كده
    const alreadySubscribed = localStorage.getItem(SUBSCRIBED_KEY) === "1";
    if (alreadySubscribed) {
      setHidden(true);
      return;
    }

    // لو قفله بالـ X قبل كده، نتأكد هل عدّت فترة الـ cooldown ولا لسه
    const dismissedAt = localStorage.getItem(DISMISSED_AT_KEY);
    if (dismissedAt) {
      const daysSinceDismiss = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < DISMISS_COOLDOWN_DAYS) {
        setHidden(true);
        return;
      }
    }

    setHidden(false);

    const el = anchorRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 } // يظهر لما 20% من العنصر يبقى ظاهر في الشاشة
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleDismiss() {
    localStorage.setItem(DISMISSED_AT_KEY, String(Date.now()));
    setHidden(true);
  }

  function handleSubscribed() {
    localStorage.setItem(SUBSCRIBED_KEY, "1");
  }

  if (hidden) {
    return <div ref={anchorRef} />;
  }

  return (
    <div ref={anchorRef} className="not-prose my-6">
      <div
        className={`relative transition-all duration-500 ease-out ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close newsletter signup"
          className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 shadow ring-1 ring-gray-200 hover:bg-gray-100 hover:text-gray-700"
        >
          ✕
        </button>
        <NewsletterSignup onSubscribed={handleSubscribed} />
      </div>
    </div>
  );
}
