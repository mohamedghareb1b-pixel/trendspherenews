import { TagRepository } from "@/domain/repositories/TagRepository";

export class ListTagsUseCase {
  constructor(private readonly tagRepository: TagRepository) {}
  async execute() {
    return this.tagRepository.list();
  }
}

export class GetArticlesByTagUseCase {
  constructor(private readonly tagRepository: TagRepository) {}
  async execute(tagSlug: string) {
    return this.tagRepository.listArticlesByTagSlug(tagSlug);
  }
}

/**
 * بياخد قائمة أسماء (نص حر، زي "AI, تقنية, ريادة أعمال" أو الـ tags المولّدة من الـ AI)
 * وبيعمل find-or-create لكل واحد، وبعدين يربطهم كلهم بالمقال (بيستبدل القديم).
 */
export class SetArticleTagsUseCase {
  constructor(private readonly tagRepository: TagRepository) {}

  async execute(articleId: string, tagNames: string[]) {
    const cleaned = tagNames.map((t) => t.trim()).filter(Boolean);
    const tags = await Promise.all(
      cleaned.map((name) => this.tagRepository.findOrCreateByName(name))
    );
    await this.tagRepository.setArticleTags(
      articleId,
      tags.map((t) => t.id)
    );
    return tags;
  }
}

export class GetArticleTagsUseCase {
  constructor(private readonly tagRepository: TagRepository) {}
  async execute(articleId: string) {
    return this.tagRepository.getArticleTags(articleId);
  }
}
