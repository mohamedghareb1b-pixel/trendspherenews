import { container } from "@/lib/container";
import { createCategoryAction } from "../actions";

export default async function CategoriesAdminPage() {
  const categories = await container.listCategories.execute();

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-bold">Categories</h1>

      <form action={createCategoryAction} className="space-y-3 rounded-xl border border-gray-100 p-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Category Name</label>
          <input name="name" required className="w-full rounded-lg border border-gray-200 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Description (optional)</label>
          <input name="description" className="w-full rounded-lg border border-gray-200 px-3 py-2" />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Add Category
        </button>
      </form>

      <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
        {categories.map((c) => (
          <div key={c.id} className="p-4">
            <p className="font-medium">{c.name}</p>
            <p className="text-xs text-gray-400">/category/{c.slug}</p>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="p-4 text-sm text-gray-500">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
