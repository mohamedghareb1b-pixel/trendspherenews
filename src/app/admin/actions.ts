"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions, ADMIN_ROLES } from "@/lib/auth";
import { container } from "@/lib/container";

async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || !ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
    redirect("/signin");
  }
  return session;
}

/** الـ FaqEditor بيبعت الأسئلة كـ JSON string جوه hidden input - هنا بنحوّلها لمصفوفة، وبنشيل أي سؤال فاضي */
function parseFaqField(raw: FormDataEntryValue | null): { question: string; answer: string }[] | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(String(raw));
    if (!Array.isArray(parsed)) return undefined;
    return parsed.filter(
      (item) => item && typeof item.question === "string" && item.question.trim() !== ""
    );
  } catch {
    return undefined;
  }
}

export async function createArticleAction(formData: FormData) {
  await requireAdminSession();

  const title = String(formData.get("title") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const content = String(formData.get("content") ?? "");
  const contentPart2 = String(formData.get("contentPart2") ?? "");
  const excerpt = String(formData.get("excerpt") ?? "");
  const heroImageUrl = String(formData.get("heroImageUrl") ?? "");
  const secondaryImageUrl = String(formData.get("secondaryImageUrl") ?? "");
  const aiSummary = String(formData.get("aiSummary") ?? "");
  const metaTitle = String(formData.get("metaTitle") ?? "");
  const metaDescription = String(formData.get("metaDescription") ?? "");
  const categoryId = String(formData.get("categoryId") ?? "");
  const tagsRaw = String(formData.get("tags") ?? "");

  const article = await container.createArticle.execute({
    title,
    slug,
    content,
    contentPart2: contentPart2 || undefined,
    excerpt: excerpt || undefined,
    heroImageUrl: heroImageUrl || undefined,
    secondaryImageUrl: secondaryImageUrl || undefined,
    aiSummary: aiSummary || undefined,
    metaTitle: metaTitle || undefined,
    metaDescription: metaDescription || undefined,
    categoryId: categoryId || undefined,
    faq: parseFaqField(formData.get("faq")),
  });

  const tagNames = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (tagNames.length > 0) {
    await container.setArticleTags.execute(article.id, tagNames);
  }

  revalidatePath("/admin");
  redirect(`/admin/articles/${article.id}`);
}

export async function updateArticleAction(articleId: string, formData: FormData) {
  await requireAdminSession();

  await container.updateArticle.execute({
    id: articleId,
    title: String(formData.get("title") ?? "") || undefined,
    content: String(formData.get("content") ?? "") || undefined,
    contentPart2: String(formData.get("contentPart2") ?? "") || undefined,
    excerpt: String(formData.get("excerpt") ?? "") || undefined,
    heroImageUrl: String(formData.get("heroImageUrl") ?? "") || undefined,
    secondaryImageUrl: String(formData.get("secondaryImageUrl") ?? "") || undefined,
    metaTitle: String(formData.get("metaTitle") ?? "") || undefined,
    metaDescription: String(formData.get("metaDescription") ?? "") || undefined,
    aiSummary: String(formData.get("aiSummary") ?? "") || undefined,
    faq: parseFaqField(formData.get("faq")),
  });

  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/admin");
}

export async function publishArticleAction(articleId: string) {
  await requireAdminSession();
  await container.publishArticle.execute(articleId);

  // إشعار المشتركين المهتمين بتصنيف المقال ده - تلقائي، بدون أي تكلفة إضافية
  await container.notifySubscribersOfNewArticle.execute(articleId);

  revalidatePath(`/admin/articles/${articleId}`);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function generateAIMetadataAction(articleId: string) {
  await requireAdminSession();
  const { suggestedTags } = await container.generateArticleAIMetadata.execute(articleId);
  if (suggestedTags.length > 0) {
    await container.setArticleTags.execute(articleId, suggestedTags);
  }
  revalidatePath(`/admin/articles/${articleId}`);
}

export async function createCategoryAction(formData: FormData) {
  await requireAdminSession();
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  await container.createCategory.execute({ name, description: description || undefined });
  revalidatePath("/admin/categories");
}

export async function setArticleCategoryAndTagsAction(
  articleId: string,
  formData: FormData
) {
  await requireAdminSession();

  const categoryId = String(formData.get("categoryId") ?? "");
  const tagsRaw = String(formData.get("tags") ?? "");
  const tagNames = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);

  await container.updateArticle.execute({ id: articleId, categoryId: categoryId || undefined });
  await container.setArticleTags.execute(articleId, tagNames);

  revalidatePath(`/admin/articles/${articleId}`);
}

export async function upsertAdSlotAction(formData: FormData) {
  await requireAdminSession();

  const key = String(formData.get("key") ?? "");
  const name = String(formData.get("name") ?? "");
  const code = String(formData.get("code") ?? "");
  const enabled = formData.get("enabled") === "on";

  await container.upsertAdSlot.execute({ key, name, code: code || null, enabled });
  revalidatePath("/admin/ads");
  revalidatePath("/");
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAdminSession();

  const keys = [
    "ga_measurement_id",
    "clarity_id",
    "google_site_verification",
    "bing_site_verification",
    "adsense_publisher_id",
  ];

  for (const key of keys) {
    const value = String(formData.get(key) ?? "").trim();
    await container.upsertSiteSetting.execute(key, value);
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}
