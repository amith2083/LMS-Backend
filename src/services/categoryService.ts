
import { AppError } from '../utils/asyncHandler';
import { ICategory } from '../interfaces/category/ICategory';
import { ICategoryRepository } from '../interfaces/category/ICategoryRepository';
import { IFileUploadService } from '../interfaces/file/IFileUploadService';
import { ICourseRepository } from '../interfaces/course/ICourseRepository'; // ← Inject
import { STATUS_CODES } from '../constants/http';

import { ICategoryService } from '../interfaces/category/ICategoryService';
import { ICategoryDocument } from '../models/category';

export class CategoryService implements ICategoryService {
  constructor(
    private categoryRepository: ICategoryRepository,
      private courseRepository: ICourseRepository ,
    private fileUploadService: IFileUploadService,
  
  ) {}

  async createCategory(title:string,description:string): Promise<ICategoryDocument> {
    if (!title) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Category title is required');
    }

    const existing = await this.categoryRepository.findByTitle(title.trim());
    if (existing) {
      throw new AppError(STATUS_CODES.CONFLICT, 'A category with this title already exists');
    }

    return this.categoryRepository.createCategory(title,description);
  }

  async updateCategoryImage(categoryId: string, file: Express.Multer.File): Promise<ICategoryDocument> {
    if (!file) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Image file is required');
    }

    const imageUrl = await this.fileUploadService.uploadFile(file, 'lms/categories');
    const updated = await this.categoryRepository.updateCategory(categoryId, { thumbnail: imageUrl });
    if (!updated) throw new AppError(STATUS_CODES.NOT_FOUND, 'Category not found');
    return updated;
  }

  async getCategories(): Promise<ICategoryDocument[]> {
    return this.categoryRepository.getCategories();
  }

  async getCategory(id: string): Promise<ICategoryDocument> {
    const category = await this.categoryRepository.getCategory(id);
    if (!category) throw new AppError(STATUS_CODES.NOT_FOUND, 'Category not found');
    return category;
  }

  async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategoryDocument> {
    const updated = await this.categoryRepository.updateCategory(id, data);
    if (!updated) throw new AppError(STATUS_CODES.NOT_FOUND, 'Category not found');
    return updated;
  }

  async changeCategoryPublishState(id: string): Promise<boolean> {
    return this.categoryRepository.changeCategoryPublishState(id);
  }

  async deleteCategory(id: string): Promise<void> {
    // ← Now done in SERVICE
    const category = await this.categoryRepository.getCategory(id);
    if (!category) throw new AppError(STATUS_CODES.NOT_FOUND, 'Category not found');

    const courses = await this.courseRepository.getCoursesByCategoryId(id);
    if (courses.length > 0) {
      throw new AppError(STATUS_CODES.CONFLICT, 'Cannot delete category with associated courses');
    }

    await this.categoryRepository.deleteCategory(id);
  }
}