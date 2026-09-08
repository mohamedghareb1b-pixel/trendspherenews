import { ContentAIPort, AIGeneratedMetadata } from "@/application/ports/ContentAIPort";

const SYSTEM_PROMPT = `أنت محرك SEO/GEO لمنصة نشر محتوى. مهمتك تحليل مقال وترجع بيانات ميتاداتا محسّنة لمحركات البحث ولمحركات الذكاء الاصطناعي (ChatGPT, Claude, Perplexity).

لازم ترجع JSON فقط، بدون أي نص إضافي أو Markdown fences، بالشكل التالي بالظبط:
{
  "metaTitle": "عنوان SEO لا يتجاوز 60 حرف",
  "metaDescription": "وصف لا يتجاوز 155 حرف",
  "summary": "ملخص من 2-3 جمل يصلح للـ AI Overview / Featured Snippet",
  "faq": [{"question": "...", "answer": "..."}],
  "tags": ["كلمة مفتاحية 1", "كلمة مفتاحية 2"]
}

اعمل 3-5 أسئلة FAQ حقيقية مرتبطة بمحتوى المقال، و3-6 tags.`;

export class AnthropicContentAI implements ContentAIPort {
  private readonly apiKey: string;
  private readonly model = "claude-sonnet-5";

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? process.env.ANTHROPIC_API_KEY ?? "";
  }

  async generateArticleMetadata(params: {
    title: string;
    content: string;
  }): Promise<AIGeneratedMetadata> {
    if (!this.apiKey) {
      throw new Error("ANTHROPIC_API_KEY غير موجود في متغيرات البيئة");
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `العنوان: ${params.title}\n\nالمحتوى:\n${params.content.slice(0, 8000)}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`فشل استدعاء Claude API: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const textBlock = data.content?.find((block: { type: string }) => block.type === "text");
    if (!textBlock?.text) {
      throw new Error("رد غير متوقع من Claude API");
    }

    const cleaned = textBlock.text.replace(/```json|```/g, "").trim();

    let parsed: AIGeneratedMetadata;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error("فشل تحليل الرد كـ JSON صحيح");
    }

    return {
      metaTitle: parsed.metaTitle ?? params.title,
      metaDescription: parsed.metaDescription ?? "",
      summary: parsed.summary ?? "",
      faq: Array.isArray(parsed.faq) ? parsed.faq : [],
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    };
  }
}
