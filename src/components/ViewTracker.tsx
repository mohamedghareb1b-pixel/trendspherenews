"use client";

import { useEffect } from "react";

export function ViewTracker({ articleId, path }: { articleId?: string; path: string }) {
  useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        articleId,
        path,
        referrer: document.referrer || undefined,
      }),
      keepalive: true,
    }).catch(() => {
      /* التتبع مش حرج - بنتجاهل أي فشل بصمت */
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
