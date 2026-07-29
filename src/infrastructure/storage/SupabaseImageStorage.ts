import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { randomUUID } from "crypto";
import { ImageStoragePort } from "@/application/ports/ImageStoragePort";

const MAX_WIDTH = 2000; // بيمنع رفع صور ضخمة أوي بلا داعي
const WEBP_QUALITY = 82; // توازن كويس بين الحجم والجودة

export class SupabaseImageStorage implements ImageStoragePort {
  private getClient() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("SUPABASE_URL أو SUPABASE_SERVICE_ROLE_KEY غير موجودين في .env");
    }
    return createClient(url, key);
  }

  private getBucket() {
    return process.env.SUPABASE_STORAGE_BUCKET ?? "article-images";
  }

  async uploadImage(input: {
    buffer: Buffer;
    folder: string;
    filenameHint?: string;
  }): Promise<string> {
    const supabase = this.getClient();
    const bucket = this.getBucket();

    // التحويل لـ WebP - بيقلل حجم الصورة كتير من غير فرق ملحوظ في الجودة
    const webpBuffer = await sharp(input.buffer)
      .rotate() // يحترم اتجاه الصورة الأصلي (EXIF) قبل أي تعديل
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const safeHint = (input.filenameHint ?? "image")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60);

    const path = `${input.folder}/${safeHint}-${randomUUID()}.webp`;

    const { error } = await supabase.storage.from(bucket).upload(path, webpBuffer, {
      contentType: "image/webp",
      upsert: false,
    });

    if (error) {
      throw new Error(`فشل رفع الصورة على Supabase: ${error.message}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
