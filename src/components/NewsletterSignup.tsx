"use client";

import { useState } from "react";

interface Category {
  id: string;
  name: string;
}

export function NewsletterSignup({ categories }: { categories: Category[] }) {
  const [email, setEmail] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function toggleCategory(name: string) {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (selectedCategories.length === 0) {
      setError("Please choose at least one topic you're interested in.");
      return;
    }

    setState("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, preferredCategories: selectedCategories }),
      });
      if (!res.ok) throw new Error();
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
        Check your inbox to confirm your subscription ✅
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-brand-50 p-5">
      <h3 className="font-semibold">Subscribe to our newsletter</h3>
      <p className="mt-1 text-sm text-gray-600">
        Choose the topics you care about - we&apos;ll only email you when we publish something
        new in those categories.
      </p>

      {categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => (
            <label
              key={c.id}
              className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${
                selectedCategories.includes(c.name)
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedCategories.includes(c.name)}
                onChange={() => toggleCategory(c.name)}
              />
              {c.name}
            </label>
          ))}
        </div>
      )}

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

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
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
