// src/repositories/categoryRepository.ts
import { ICategory } from '../interfaces/category/ICategory';
import { ICategoryRepository } from '../interfaces/category/ICategoryRepository';
import { Category } from '../models/category';

export class CategoryRepository implements ICategoryRepository {
  async getCategories(): Promise<ICategory[]> {
    return Category.find({}).lean().exec();
  }

  async getCategory(id: string): Promise<ICategory | null> {
    return Category.findById(id).lean().exec();
  }

  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    const category = await Category.create(data);
    return category.toObject();
  }

  async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    return Category.findByIdAndUpdate(id, data, { new: true }).lean().exec();
  }

  async changeCategoryPublishState(id: string): Promise<boolean> {
    const category = await Category.findById(id).exec();
    if (!category) throw new Error('Category not found');

    category.status = !category.status;
    await category.save();
    return category.status;
  }

  async deleteCategory(id: string): Promise<void> {
    await Category.findByIdAndDelete(id).exec();
  }

  async findByTitle(title: string): Promise<ICategory | null> {
    return Category.findOne({
      title: { $regex: `^${title}$`, $options: 'i' },
    }).lean().exec();
  }
}