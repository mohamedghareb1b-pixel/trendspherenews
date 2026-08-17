"use client";

import { useEffect, useState } from "react";

export function ReadingModeToggle() {
  const [sepia, setSepia] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("reading-mode-sepia");
    if (saved === "true") setSepia(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("reading-sepia", sepia);
    localStorage.setItem("reading-mode-sepia", String(sepia));
  }, [sepia]);

  return (
    <button
      onClick={() => setSepia((s) => !s)}
      className={`not-prose flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        sepia
          ? "border-amber-300 bg-amber-100 text-amber-800"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
      title="Comfortable reading mode"
    >
      <span>📖</span>
      {sepia ? "Reading mode: On" : "Reading mode"}
    </button>
  );
}