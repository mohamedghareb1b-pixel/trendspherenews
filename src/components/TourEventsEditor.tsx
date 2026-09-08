"use client";

import { useState } from "react";

interface TourEvent {
  date: string;
  time: string;
  venue: string;
  city: string;
  state: string;
  ticketLink: string;
}

const emptyEvent: TourEvent = {
  date: "",
  time: "",
  venue: "",
  city: "",
  state: "",
  ticketLink: "",
};

/**
 * فورم ديناميكي لإدخال جدول حفلات "ارتيكل 2" - زرار "ضيف حفلة" بيضيف صف جديد،
 * وكل صف قابل للحذف. البيانات بتتبعت مع الفورم كـ JSON جوه hidden input.
 */
export function TourEventsEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: TourEvent[];
}) {
  const [events, setEvents] = useState<TourEvent[]>(
    defaultValue.length > 0 ? defaultValue : [{ ...emptyEvent }]
  );

  function updateEvent(index: number, field: keyof TourEvent, value: string) {
    setEvents((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  }

  function addEvent() {
    setEvents((prev) => [...prev, { ...emptyEvent }]);
  }

  function removeEvent(index: number) {
    setEvents((prev) => prev.filter((_, i) => i !== index));
  }

  // بنستبعد الصفوف الفاضية تمامًا (من غير تاريخ) وقت الحفظ فقط
  const cleanEvents = events.filter((e) => e.date.trim() !== "");

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(cleanEvents)} />

      {events.map((event, i) => (
        <div key={i} className="space-y-2 rounded-lg border border-gray-100 p-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-gray-500">Date</label>
              <input
                type="date"
                value={event.date}
                onChange={(e) => updateEvent(i, "date", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Time</label>
              <input
                type="time"
                value={event.time}
                onChange={(e) => updateEvent(i, "time", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Venue</label>
              <input
                value={event.venue}
                onChange={(e) => updateEvent(i, "venue", e.target.value)}
                placeholder="Madison Square Garden"
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">City</label>
              <input
                value={event.city}
                onChange={(e) => updateEvent(i, "city", e.target.value)}
                placeholder="New York"
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">State</label>
              <input
                value={event.state}
                onChange={(e) => updateEvent(i, "state", e.target.value)}
                placeholder="NY"
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">Ticket Link</label>
              <input
                type="url"
                value={event.ticketLink}
                onChange={(e) => updateEvent(i, "ticketLink", e.target.value)}
                placeholder="https://www.ticketnetwork.com/..."
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeEvent(i)}
            className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
          >
            Remove Date
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addEvent}
        className="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
      >
        + Add Tour Date
      </button>
    </div>
  );
}
