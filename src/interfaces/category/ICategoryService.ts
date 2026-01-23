import { ICategoryDocument } from "../../models/category";
import { ICategory } from "./ICategory";


export interface ICategoryService {
  createCategory(title:string,description:string): Promise<ICategoryDocument>;
   updateCategoryImage(
    categoryId: string,
    file: Express.Multer.File
  ): Promise<ICategoryDocument | null>;
  getCategories(): Promise<ICategoryDocument[]>;
  getCategory(id: string): Promise<ICategoryDocument | null>;
  updateCategory(id: string, data: Partial<ICategory>): Promise<ICategoryDocument | null>;
  changeCategoryPublishState(id: string): Promise<boolean>;
  deleteCategory(id: string): Promise<void>;
}
