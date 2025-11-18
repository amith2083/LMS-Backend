
import { Request, Response } from 'express';
import { ICategoryController } from '../interfaces/category/ICategoryController';
import { ICategoryService } from '../interfaces/category/ICategoryService';
import { STATUS_CODES } from '../constants/http';

export class CategoryController implements ICategoryController {
  constructor(private categoryService: ICategoryService) {}

  async createCategory(req: Request, res: Response): Promise<void> {
    const category = await this.categoryService.createCategory(req.body);
    res.status(STATUS_CODES.CREATED).json(category);
  }

  async updateCategoryImage(req: Request, res: Response): Promise<void> {
    const file = req.file!;
    const updated = await this.categoryService.updateCategoryImage(req.params.id, file);
    res.json(updated);
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    const categories = await this.categoryService.getCategories();
    res.json(categories);
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    const category = await this.categoryService.getCategory(req.params.id);
    res.json(category); // ← Service throws 404
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    const updated = await this.categoryService.updateCategory(req.params.id, req.body);
    res.json(updated);
  }

  async changeCategoryPublishState(req: Request, res: Response): Promise<void> {
    const status = await this.categoryService.changeCategoryPublishState(req.params.id);
    res.json({ status });
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    await this.categoryService.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  }
}