import type { TourEvent } from "@/domain/entities/Article";
import { Article } from "@/domain/entities/Article";

function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  if (Number.isNaN(h)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m ?? 0).padStart(2, "0")} ${period}`;
}

/**
 * جدول حفلات "ارتيكل 2" - بيتحسب وقت العرض (server-side) مين من الحفلات فاتت
 * فبيبقى مكتوب عليها "Ended" بدل زرار "Get Tickets"، مفيش حاجة بتتشال من الداتا.
 */
export function TourEventsTable({ events }: { events: TourEvent[] }) {
  if (!events || events.length === 0) return null;

  const sorted = [...events].sort((a, b) =>
    `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)
  );

  return (
    <div className="not-prose">
      {/* نسخة الشاشات الكبيرة - جدول حقيقي */}
      <div className="hidden overflow-x-auto rounded-xl border border-gray-100 sm:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Venue</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Tickets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((event, i) => {
              const ended = Article.isTourEventEnded(event);
              return (
                <tr key={i} className={ended ? "opacity-50" : "hover:bg-gray-50"}>
                  <td className="px-4 py-3 font-medium text-gray-900">{formatDate(event.date)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatTime(event.time)}</td>
                  <td className="px-4 py-3 text-gray-600">{event.venue}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {event.city}
                    {event.state ? `, ${event.state}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    {ended ? (
                      <span className="font-medium text-gray-400">Ended</span>
                    ) : event.ticketLink ? (
                      <a
                        href={event.ticketLink}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="inline-block rounded-full bg-brand-500 px-4 py-1.5 font-semibold text-white hover:bg-brand-700"
                      >
                        Get Tickets
                      </a>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* نسخة الموبايل - كروت مرصوصة بدل جدول ضيق */}
      <div className="flex flex-col gap-3 sm:hidden">
        {sorted.map((event, i) => {
          const ended = Article.isTourEventEnded(event);
          return (
            <div
              key={i}
              className={`rounded-xl border border-gray-100 p-4 ${ended ? "opacity-50" : ""}`}
            >
              <p className="mb-2 font-semibold text-gray-900">
                {formatDate(event.date)}
                {event.time ? ` · ${formatTime(event.time)}` : ""}
              </p>
              <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-sm text-gray-600">
                <dt className="font-medium text-gray-400">Venue</dt>
                <dd>{event.venue}</dd>
                <dt className="font-medium text-gray-400">Location</dt>
                <dd>
                  {event.city}
                  {event.state ? `, ${event.state}` : ""}
                </dd>
              </dl>
              {ended ? (
                <span className="mt-3 inline-block font-medium text-gray-400">Ended</span>
              ) : event.ticketLink ? (
                <a
                  href={event.ticketLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-3 inline-block rounded-full bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Get Tickets
                </a>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
