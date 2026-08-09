import { google } from "googleapis";

/**
 * بيبعت إشعار لـ Google Indexing API إن رابط اتنشر أو اتشال.
 *
 * محتاج Service Account JSON عشان يشتغل - بيتقرأ من متغير بيئة واحد
 * (مش ملف على الديسك، عشان Vercel serverless مالوش تخزين دائم):
 *
 *   GOOGLE_SERVICE_ACCOUNT_JSON = محتوى ملف الـ JSON كامل كـ سطر واحد
 *
 * الخطوات المطلوبة قبل ما يشتغل:
 * 1. في Google Cloud Console، فعّل "Web Search Indexing API" للمشروع
 * 2. أنشئ Service Account وحمّل ملف الـ JSON بتاعه
 * 3. في Google Search Console، ضيف إيميل الـ Service Account
 *    (شكله client_email@...iam.gserviceaccount.com) كـ "Owner" على خاصية الموقع
 * 4. انسخ محتوى ملف الـ JSON كامل والصقه كـ قيمة واحدة في
 *    GOOGLE_SERVICE_ACCOUNT_JSON في Vercel Environment Variables
 */

type IndexingType = "URL_UPDATED" | "URL_DELETED";

export async function notifyGoogleIndexing(url: string, type: IndexingType): Promise<void> {
  const rawCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!rawCredentials) {
    // مش متظبط لسه - نسجل تحذير ومنكملش، من غير ما نوقف عملية النشر
    console.warn("GOOGLE_SERVICE_ACCOUNT_JSON غير موجود - تم تخطي إشعار Google Indexing");
    return;
  }

  try {
    const credentials = JSON.parse(rawCredentials);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    const client = await auth.getClient();
    const indexing = google.indexing({ version: "v3", auth: client as any });

    await indexing.urlNotifications.publish({
      requestBody: { url, type },
    });

    console.log(`Google Indexing: ${type} تم إرساله لـ ${url}`);
  } catch (error) {
    // مش هنوقف عملية النشر بسبب فشل إشعار جوجل - المقال اتنشر بالفعل على الموقع
    console.error("فشل إرسال إشعار Google Indexing:", error);
  }
}