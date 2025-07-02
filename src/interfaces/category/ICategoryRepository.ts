import { ICategory } from "./ICategory";


export interface ICategoryRepository {
  getCategories(): Promise<ICategory[]>;
  getCategory(id: string): Promise<ICategory | null>;
  createCategory(data: Partial<ICategory>): Promise<ICategory>;
  updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null>;
  changeCategoryPublishState(id: string): Promise<boolean>;
  deleteCategory(id: string): Promise<void>;
  findByTitle(title: string): Promise<ICategory | null>;
}
