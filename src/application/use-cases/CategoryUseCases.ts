import { randomUUID } from "crypto";
import { Category } from "@/domain/entities/Category";
import { CategoryRepository } from "@/domain/repositories/CategoryRepository";
import { slugify } from "@/lib/slugify";

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: { name: string; description?: string; parentId?: string }) {
    const slug = slugify(input.name);
    const existing = await this.categoryRepository.findBySlug(slug);
    if (existing) throw new Error(`تصنيف بنفس الاسم "${input.name}" موجود بالفعل`);

    return this.categoryRepository.create(
      new Category(randomUUID(), input.name, slug, input.description ?? null, input.parentId ?? null)
    );
  }
}

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute() {
    return this.categoryRepository.list();
  }
}

export class GetCategoryBySlugUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(slug: string) {
    return this.categoryRepository.findBySlug(slug);
  }
}

export class GetCategoryByIdUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: string) {
    return this.categoryRepository.findById(id);
  }
}
