import { container } from "@/lib/container";
import { SITE_SETTING_KEYS } from "@/application/use-cases/SiteSettingsUseCases";

export const revalidate = 3600;

/**
 * ads.txt لازم يكون متاح على /ads.txt بالظبط في جذر الدومين.
 * جوجل بتتحقق منه أثناء مراجعة طلب AdSense وبعد القبول باستمرار.
 * التنسيق: <SYSTEM>, <PUBLISHER_ID>, <RELATIONSHIP>, <CERT_AUTHORITY_ID>
 */
export async function GET() {
  const settings = await container.getSiteSettings.execute();
  const publisherId = settings[SITE_SETTING_KEYS.ADSENSE_PUBLISHER_ID];

  const lines: string[] = [];

  if (publisherId) {
    lines.push(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`);
  }

  const body = lines.length > 0 ? lines.join("\n") + "\n" : "";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
