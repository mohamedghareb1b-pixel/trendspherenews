"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: FaqItem[];
}) {
  const [items, setItems] = useState<FaqItem[]>(
    defaultValue.length > 0 ? defaultValue : []
  );

  function updateItem(index: number, field: keyof FaqItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { question: "", answer: "" }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {/* The actual data submitted with the form */}
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-gray-100 p-3">
          <div className="flex items-start justify-between gap-2">
            <input
              placeholder="Question"
              value={item.question}
              onChange={(e) => updateItem(i, "question", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="shrink-0 rounded-lg border border-gray-200 px-2 py-2 text-xs text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
          <textarea
            placeholder="Answer"
            rows={2}
            value={item.answer}
            onChange={(e) => updateItem(i, "answer", e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
      >
        + Add Question
      </button>
    </div>
  );
}
