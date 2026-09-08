import Link from "next/link";
import { container } from "@/lib/container";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  review: "In Review",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  review: "bg-yellow-100 text-yellow-700",
  scheduled: "bg-blue-100 text-blue-700",
  published: "bg-green-100 text-green-700",
  archived: "bg-red-100 text-red-700",
};

export default async function AdminTourArticlesPage() {
  const articles = await container.getAllArticlesForAdmin.execute({ limit: 100, type: "tour" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tour Articles (Article 2)</h1>
        <Link
          href="/admin/tour-articles/new"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          + New Tour Article
        </Link>
      </div>

      {articles.length === 0 && (
        <p className="text-gray-500">No tour articles yet. Create your first one.</p>
      )}

      <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/admin/tour-articles/${article.id}`}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{article.title}</p>
              <p className="text-xs text-gray-400">
                /tours/{article.slug} · {article.tourEvents.length} dates
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                statusColors[article.status] ?? "bg-gray-100"
              }`}
            >
              {statusLabels[article.status] ?? article.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
