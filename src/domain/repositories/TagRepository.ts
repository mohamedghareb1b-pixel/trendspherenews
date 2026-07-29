import { Tag } from "../entities/Tag";
import { Article } from "../entities/Article";

export interface TagRepository {
  findBySlug(slug: string): Promise<Tag | null>;
  findOrCreateByName(name: string): Promise<Tag>;
  list(): Promise<Tag[]>;

  /** يستبدل كل وسوم المقال بالقائمة الجديدة */
  setArticleTags(articleId: string, tagIds: string[]): Promise<void>;
  getArticleTags(articleId: string): Promise<Tag[]>;
  listArticlesByTagSlug(tagSlug: string): Promise<Article[]>;
}
