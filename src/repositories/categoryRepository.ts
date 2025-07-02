import { ICategory } from "../interfaces/category/ICategory";
import { ICategoryRepository } from "../interfaces/category/ICategoryRepository";
import { Category } from "../models/category";
import { Course } from "../models/course";


export class CategoryRepository implements ICategoryRepository {
  async getCategories(): Promise<ICategory[]> {
    const categories = await Category.find({}).lean();
    return categories;
  }

  async getCategory(id: string): Promise<ICategory | null> {
    const category = await Category.findById(id).lean();
    return category
  }

  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    const category = await Category.create(data);
    return JSON.parse(JSON.stringify(category));
  }

  async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    const updated = await Category.findByIdAndUpdate(id, data, { new: true }).lean();
    return updated
  }

  async changeCategoryPublishState(id: string): Promise<boolean> {
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");

    category.status = !category.status;
    await category.save();
    return category.status;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");

    const courses = await Course.find({ category: id }).lean();
    if (courses.length > 0) {
      throw new Error("Cannot delete category with associated courses");
    }

    await Category.findByIdAndDelete(id);
  }

  async findByTitle(title: string): Promise<ICategory | null> {
    return Category.findOne({
      title: { $regex: `^${title}$`, $options: "i" },
    }).lean().exec();
  }
}
