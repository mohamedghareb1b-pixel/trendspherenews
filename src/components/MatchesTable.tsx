interface MatchRow {
  opponent: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  state: string;
  status: string;
  ticketLink?: string;
}

/**
 * بيتحول من نص خام (كل مباراة سطر، الحقول مفصولة بـ |) لصفوف منظمة.
 * الترتيب المتوقع في كل سطر:
 * الخصم | التاريخ | الميعاد | الملعب | المدينة | الولاية | الحالة | رابط التذاكر (اختياري)
 */
function parseMatchesData(raw: string): MatchRow[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      return {
        opponent: parts[0] ?? "",
        date: parts[1] ?? "",
        time: parts[2] ?? "",
        venue: parts[3] ?? "",
        city: parts[4] ?? "",
        state: parts[5] ?? "",
        status: parts[6] ?? "",
        ticketLink: parts[7] || undefined,
      };
    })
    .filter((row) => row.opponent); // تجاهل أي سطر فاضي أو ناقص الحقل الأساسي
}

export function MatchesTable({ data }: { data: string }) {
  const matches = parseMatchesData(data);
  if (matches.length === 0) return null;

  return (
    <div className="not-prose">
      {/* نسخة الشاشات الكبيرة - جدول حقيقي */}
      <div className="hidden overflow-x-auto rounded-xl border border-gray-100 sm:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Opponent</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Venue</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tickets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {matches.map((m, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{m.opponent}</td>
                <td className="px-4 py-3 text-gray-600">{m.date}</td>
                <td className="px-4 py-3 text-gray-600">{m.time}</td>
                <td className="px-4 py-3 text-gray-600">{m.venue}</td>
                <td className="px-4 py-3 text-gray-600">
                  {m.city}
                  {m.state ? `, ${m.state}` : ""}
                </td>
                <td className="px-4 py-3 text-gray-600">{m.status}</td>
                <td className="px-4 py-3">
                  {m.ticketLink ? (
                    <a
                      href={m.ticketLink}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="font-semibold text-brand-700 underline decoration-2 underline-offset-2 hover:text-brand-900"
                    >
                      Tickets
                    </a>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نسخة الموبايل - كروت مرصوصة بدل جدول ضيق */}
      <div className="flex flex-col gap-3 sm:hidden">
        {matches.map((m, i) => (
          <div key={i} className="rounded-xl border border-gray-100 p-4">
            <p className="mb-2 font-semibold text-gray-900">{m.opponent}</p>
            <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-sm text-gray-600">
              <dt className="font-medium text-gray-400">Date</dt>
              <dd>{m.date}</dd>
              <dt className="font-medium text-gray-400">Time</dt>
              <dd>{m.time}</dd>
              <dt className="font-medium text-gray-400">Venue</dt>
              <dd>{m.venue}</dd>
              <dt className="font-medium text-gray-400">Location</dt>
              <dd>
                {m.city}
                {m.state ? `, ${m.state}` : ""}
              </dd>
              <dt className="font-medium text-gray-400">Status</dt>
              <dd>{m.status}</dd>
            </dl>
            {m.ticketLink && (
              <a
                href={m.ticketLink}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="mt-3 inline-block font-semibold text-brand-700 underline decoration-2 underline-offset-2 hover:text-brand-900"
              >
                Check Tickets
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
