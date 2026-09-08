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

export default async function AdminDashboardPage() {
  const articles = await container.getAllArticlesForAdmin.execute({ limit: 100 });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manage Articles</h1>

      {articles.length === 0 && (
        <p className="text-gray-500">No articles yet. Create your first one.</p>
      )}

      <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/admin/articles/${article.id}`}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{article.title}</p>
              <p className="text-xs text-gray-400">/{article.slug}</p>
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
