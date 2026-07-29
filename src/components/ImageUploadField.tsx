"use client";

import { useState } from "react";

export function ImageUploadField({
  name,
  label,
  defaultUrl,
}: {
  name: string;
  label: string;
  defaultUrl?: string;
}) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      setUrl(data.url);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>

      {/* الرابط النهائي (بعد الرفع لـ Supabase وتحويله WebP) بيتحط هنا وبيتبعت مع الفورم الأساسي */}
      <input type="hidden" name={name} value={url} />

      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="mb-2 h-32 w-full rounded-lg object-cover" />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm"
      />

      {status === "uploading" && (
        <p className="mt-1 text-xs text-gray-400">Uploading and converting to WebP...</p>
      )}
      {status === "error" && (
        <p className="mt-1 text-xs text-red-600">Upload failed, please try again.</p>
      )}
    </div>
  );
}
