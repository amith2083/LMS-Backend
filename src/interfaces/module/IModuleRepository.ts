import { Types } from "mongoose";
import { IModule } from "./IModule";


export interface IModuleRepository {
  createModule(data: Partial<IModule>): Promise<string>;
  getModule(moduleId: string): Promise<IModule | null>;
  updateModule(moduleId: string, data: Partial<IModule>): Promise<IModule | null>;
  // changeModulePublishState(moduleId: string): Promise<boolean>;
  addLessonToModule(moduleId: string, lessonId: string): Promise<void>;
  removeLessonFromModule(moduleId: string, lessonId: string): Promise<void>
  deleteModule(moduleId: string): Promise<void>;
  findByTitleAndCourse(title: string, courseId: string| Types.ObjectId): Promise<IModule | null>;
  // saveModule(module: IModule): Promise<void>;

}
