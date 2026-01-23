import { ICategory } from '../interfaces/category/ICategory';
import { ICategoryRepository } from '../interfaces/category/ICategoryRepository';
import { Category, ICategoryDocument } from '../models/category';

export class CategoryRepository implements ICategoryRepository {
  async getCategories(): Promise<ICategoryDocument[]> {
    return await Category.find({});
  }

  async getCategory(id: string): Promise<ICategoryDocument | null> {
    return await Category.findById(id);
  }

  async createCategory(title:string,description:string): Promise<ICategoryDocument> {
    const category = await Category.create({title,description});
    return category;
  }

  async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategoryDocument | null> {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  }

  async changeCategoryPublishState(id: string): Promise<boolean> {
    const category = await Category.findById(id);
    if (!category) throw new Error('Category not found');

    category.status = !category.status;
    await category.save();
    return category.status;
  }

  async deleteCategory(id: string): Promise<void> {
    await Category.findByIdAndDelete(id);
  }

  async findByTitle(title: string): Promise<ICategoryDocument | null> {
    return await Category.findOne({
      title: { $regex: `^${title}$`, $options: 'i' },
    });
  }
}