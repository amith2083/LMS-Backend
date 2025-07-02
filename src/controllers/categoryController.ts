import { Request, Response } from "express";
import { ICategoryController } from "../interfaces/category/ICategoryController";
import { ICategoryService } from "../interfaces/category/ICategoryService";
import { STATUS_CODES } from "../constants/http";
import { ERROR_MESSAGES } from "../constants/messages";


export class CategoryController implements ICategoryController {
  constructor(private categoryService: ICategoryService) {}

  async createCategory(req: Request, res: Response): Promise<void> {
    const category = await this.categoryService.createCategory(req.body);
    res.status(STATUS_CODES.CREATED).json(category);
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    const categories = await this.categoryService.getCategories();
    res.status(STATUS_CODES.OK).json(categories);
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    const category = await this.categoryService.getCategory(req.params.id);
    if (!category) {
      res.status(STATUS_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.NOT_FOUND });
      return;
    }
    res.status(STATUS_CODES.OK).json(category);
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    const updated = await this.categoryService.updateCategory(req.params.id, req.body);
    res.status(STATUS_CODES.OK).json(updated);
  }

  async changeCategoryPublishState(req: Request, res: Response): Promise<void> {
    const status = await this.categoryService.changeCategoryPublishState(req.params.id);
    res.status(STATUS_CODES.OK).json({ status });
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    await this.categoryService.deleteCategory(req.params.id);
    res.status(STATUS_CODES.OK).json({ message: "Category deleted successfully" });
  }
}
