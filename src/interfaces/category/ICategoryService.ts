import { ICategory } from "./ICategory";


export interface ICategoryService {
  createCategory(data: Partial<ICategory>): Promise<ICategory>;
  getCategories(): Promise<ICategory[]>;
  getCategory(id: string): Promise<ICategory | null>;
  updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null>;
  changeCategoryPublishState(id: string): Promise<boolean>;
  deleteCategory(id: string): Promise<void>;
}
