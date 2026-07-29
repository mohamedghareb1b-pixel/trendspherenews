import { container } from "@/lib/container";

export default async function AnalyticsPage() {
  const { totalViews, topArticles, dailyViews, sinceDays } =
    await container.getAnalyticsSummary.execute(30);

  const maxDaily = Math.max(1, ...dailyViews.map((d) => d.views));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Total Views (last {sinceDays} days)</p>
          <p className="mt-1 text-3xl font-bold">{totalViews.toLocaleString("en-US")}</p>
        </div>
        <div className="rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Most Viewed Article</p>
          <p className="mt-1 truncate text-lg font-semibold">
            {topArticles[0]?.title ?? "—"}
          </p>
        </div>
        <div className="rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Average Daily Views</p>
          <p className="mt-1 text-3xl font-bold">
            {Math.round(totalViews / sinceDays).toLocaleString("en-US")}
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-semibold">Daily Views</h2>
        <div className="flex h-40 items-end gap-1 rounded-xl border border-gray-100 p-4">
          {dailyViews.length === 0 && (
            <p className="text-sm text-gray-400">Not enough data yet.</p>
          )}
          {dailyViews.map((d) => (
            <div key={d.date} className="flex-1" title={`${d.date}: ${d.views}`}>
              <div
                className="rounded-t bg-brand-500"
                style={{ height: `${(d.views / maxDaily) * 100}%`, minHeight: 2 }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-semibold">Top 10 Articles</h2>
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
          {topArticles.map((a, i) => (
            <div key={a.articleId} className="flex items-center justify-between p-3">
              <span className="text-sm">
                <span className="text-gray-400">{i + 1}.</span> {a.title}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {a.views.toLocaleString("en-US")} views
              </span>
            </div>
          ))}
          {topArticles.length === 0 && (
            <p className="p-4 text-sm text-gray-500">Not enough data yet.</p>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        This is a simple internal tracker (cookie-free page views). For deeper insights
        (traffic sources, countries, devices...) use GA4 - add{" "}
        <code>NEXT_PUBLIC_GA_MEASUREMENT_ID</code> to <code>.env</code>.
      </p>
    </div>
  );
}
