import { container } from "@/lib/container";
import { AdSlotRenderer } from "./AdSlotRenderer";

export async function AdSlot({ slotKey }: { slotKey: string }) {
  const slot = await container.getAdSlot.execute(slotKey);
  if (!slot || !slot.isRenderable()) return null;

  return (
    <div className="ad-slot my-4 flex justify-center overflow-hidden" data-ad-slot={slotKey}>
      <AdSlotRenderer code={slot.code ?? ""} />
    </div>
  );
}
