export interface AIGeneratedMetadata {
  metaTitle: string;
  metaDescription: string;
  summary: string;
  faq: { question: string; answer: string }[];
  tags: string[];
}

/**
 * العقد اللي أي مزود AI (Claude, GPT, Gemini...) لازم يلتزم بيه.
 * الـ Use Case هيتعامل مع الواجهة دي بس، مش مع تفاصيل أي API معين.
 */
export interface ContentAIPort {
  generateArticleMetadata(params: {
    title: string;
    content: string;
  }): Promise<AIGeneratedMetadata>;
}
