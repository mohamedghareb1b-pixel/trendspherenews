"use client";

import { useEffect, useState } from "react";

interface SocialFollowPromptProps {
  threadsUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  substackUrl?: string;
}

const ICONS: Record<string, { label: string; icon: string }> = {
  threadsUrl: {
    label: "Threads",
    icon: "https://cdn.simpleicons.org/threads/000000",
  },
  facebookUrl: {
    label: "Facebook",
    icon: "https://cdn.simpleicons.org/facebook/1877F2",
  },
  twitterUrl: {
    label: "X / Twitter",
    icon: "https://cdn.simpleicons.org/x/000000",
  },
  substackUrl: {
    label: "Substack",
    icon: "https://cdn.simpleicons.org/substack/FF6719",
  },
};

export function SocialFollowPrompt({
  threadsUrl,
  facebookUrl,
  twitterUrl,
  substackUrl,
}: SocialFollowPromptProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const links: Record<string, string | undefined> = {
    threadsUrl,
    facebookUrl,
    twitterUrl,
    substackUrl,
  };
  const activeLinks = Object.entries(links).filter(([, url]) => !!url);

  useEffect(() => {
    if (activeLinks.length === 0) return;
    const timer = setTimeout(() => setVisible(true), 60_000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (activeLinks.length === 0 || !visible || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-xs animate-in slide-in-from-bottom-4 flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
      <button
        onClick={() => setDismissed(true)}
        aria-label="Close"
        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>
      <p className="pr-4 text-sm font-medium text-gray-800">
        Enjoying this? Follow us for more
      </p>
      <div className="flex gap-2">
        {activeLinks.map(([key, url]) => (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={ICONS[key].label}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 p-2 transition hover:scale-105 hover:bg-gray-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ICONS[key].icon}
              alt={ICONS[key].label}
              className="h-full w-full object-contain"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
