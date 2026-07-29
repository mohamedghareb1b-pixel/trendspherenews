import { container } from "@/lib/container";

export default async function TagsAdminPage() {
  const tags = await container.listTags.execute();

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Tags</h1>
      <p className="text-sm text-gray-500">
        Tags are created automatically by the &quot;Generate SEO/FAQ with AI&quot; button, or
        you can add them manually when creating or editing an article.
      </p>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
          >
            #{tag.name}
          </span>
        ))}
        {tags.length === 0 && <p className="text-sm text-gray-500">No tags yet.</p>}
      </div>
    </div>
  );
}
