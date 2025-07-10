import { Types } from "mongoose";
import { IModule } from "./IModule";


export interface IModuleRepository {
  createModule(data: Partial<IModule>): Promise<IModule>;
  getModule(moduleId: string): Promise<IModule | null>;
  updateModule(moduleId: string, data: Partial<IModule>): Promise<IModule | null>;
  // changeModulePublishState(moduleId: string): Promise<boolean>;
  deleteModule(moduleId: string, courseId: string): Promise<void>;
  findByTitleAndCourse(title: string, courseId: string| Types.ObjectId): Promise<IModule | null>;
  saveModule(module: IModule): Promise<void>;

}
