export const revalidate = 86400;

/**
 * ads.txt لازم يكون متاح على /ads.txt بالظبط في جذر الدومين.
 * جوجل بتتحقق منه أثناء مراجعة طلب AdSense وبعد القبول باستمرار.
 * التنسيق: <SYSTEM>, <PUBLISHER_ID>, <RELATIONSHIP>, <CERT_AUTHORITY_ID>
 */
export async function GET() {
  const publisherId = process.env.ADSENSE_PUBLISHER_ID;

  const lines: string[] = [];

  if (publisherId) {
    lines.push(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`);
  }

  // ضيف هنا أي شبكة إعلانات تانية لاحقًا (Ad Manager, شركاء آخرين...)
  // مثال: lines.push("google.com, pub-xxxxx, RESELLER, f08c47fec0942fa0");

  const body = lines.length > 0 ? lines.join("\n") + "\n" : "";

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
