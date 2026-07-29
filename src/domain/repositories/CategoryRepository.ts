import { Category } from "../entities/Category";

export interface CategoryRepository {
  findBySlug(slug: string): Promise<Category | null>;
  findById(id: string): Promise<Category | null>;
  list(): Promise<Category[]>;
  create(category: Category): Promise<Category>;
}
