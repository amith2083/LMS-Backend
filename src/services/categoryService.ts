import { ICategoryService } from "../interfaces/category/ICategoryService";
import { ICategoryRepository } from "../interfaces/category/ICategoryRepository";
import { ICategory } from "../interfaces/category/ICategory";

export class CategoryService implements ICategoryService {
  private categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    const existing = await this.categoryRepository.findByTitle(
      data.title as string
    );
    if (existing) {
      throw new Error("A category with this title already exists");
    }

    return this.categoryRepository.createCategory(data);
  }

  async getCategories(): Promise<ICategory[]> {
    return this.categoryRepository.getCategories();
  }

  async getCategory(id: string): Promise<ICategory | null> {
    return this.categoryRepository.getCategory(id);
  }

  async updateCategory(
    id: string,
    data: Partial<ICategory>
  ): Promise<ICategory | null> {
    return this.categoryRepository.updateCategory(id, data);
  }

  async changeCategoryPublishState(id: string): Promise<boolean> {
    return this.categoryRepository.changeCategoryPublishState(id);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.categoryRepository.deleteCategory(id);
  }
}
