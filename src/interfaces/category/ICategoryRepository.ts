import { ICategoryDocument } from "../../models/category";
import { ICategory } from "./ICategory";


export interface ICategoryRepository {
  getCategories(): Promise<ICategoryDocument[]>;
  getCategory(id: string): Promise<ICategoryDocument | null>;
  createCategory(title:string,description:string): Promise<ICategoryDocument>;
  updateCategory(id: string, data: Partial<ICategory>): Promise<ICategoryDocument | null>;
  changeCategoryPublishState(id: string): Promise<boolean>;
  deleteCategory(id: string): Promise<void>;
  findByTitle(title: string): Promise<ICategoryDocument | null>;
}
