import { container } from "@/lib/container";
import { upsertAdSlotAction } from "../actions";

export default async function AdsAdminPage() {
  const slots = await container.listAdSlots.execute();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Ads</h1>
        <p className="mt-1 text-sm text-gray-500">
          Paste your AdSense, Ad Manager, or any ad script for each slot, then enable it when
          ready.
        </p>
      </div>

      <div className="space-y-4">
        {slots.map((slot) => (
          <form
            key={slot.key}
            action={upsertAdSlotAction}
            className="space-y-3 rounded-xl border border-gray-100 p-4"
          >
            <input type="hidden" name="key" value={slot.key} />
            <input type="hidden" name="name" value={slot.name} />

            <div className="flex items-center justify-between">
              <p className="font-medium">{slot.name}</p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="enabled"
                  defaultChecked={slot.enabled}
                  className="h-4 w-4"
                />
                Enabled
              </label>
            </div>

            <textarea
              name="code"
              rows={4}
              placeholder="<script>...</script> or AdSense code"
              defaultValue={slot.code ?? ""}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-xs"
            />

            <button
              type="submit"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Save
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
