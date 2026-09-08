"use client";

import { useEffect, useRef } from "react";

export function AdSlotRenderer({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = code;

    // الـ <script> tags جوه innerHTML العادي مبتتنفذش تلقائيًا في المتصفح،
    // فبنعيد إنشاءها يدويًا عشان كود الإعلانات (AdSense وغيره) يشتغل فعليًا.
    const scripts = Array.from(container.querySelectorAll("script"));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.text = oldScript.text;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [code]);

  return <div ref={containerRef} className="ad-slot-inner" />;
}
