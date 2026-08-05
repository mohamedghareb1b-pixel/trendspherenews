"use client";

import { useState } from "react";

// ملاحظة: اختيار التصنيف (Category) اتشال مؤقتًا - الاشتراك بقى بإيميل بس.
// السبب: الأقسام لسه بتتظبط. لما تستقر الأقسام، رجّع الـ checkboxes القديمة
// (شوف تاريخ الـ git للنسخة اللي فيها اختيار التصنيف) عشان ترجع تستهدف كل تصنيف لوحده.

export function NewsletterSignup({ onSubscribed }: { onSubscribed?: () => void } = {}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setState("sent");
      onSubscribed?.();
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
        You&apos;re subscribed! We&apos;ll email you when we publish something new ✅
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-brand-50 p-5">
      <h3 className="font-semibold">Subscribe to our newsletter</h3>
      <p className="mt-1 text-sm text-gray-600">
        Get our latest articles straight to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {state === "loading" ? "..." : "Subscribe"}
        </button>
      </form>

      {state === "error" && (
        <p className="mt-2 text-xs text-red-600">Something went wrong, please try again.</p>
      )}
      <p className="mt-2 text-xs text-gray-400">
        By subscribing, you agree to our{" "}
        <a href="/privacy-policy" className="underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
