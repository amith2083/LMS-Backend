import { IModule } from "./IModule";


export interface IModuleService {
  createModule(data: Partial<IModule>): Promise<IModule>;
  getModule(moduleId: string): Promise<IModule | null>;
  updateModule(moduleId: string, data: Partial<IModule>): Promise<IModule | null>;
  changeModulePublishState(moduleId: string): Promise<boolean>;
  deleteModule(moduleId: string, courseId: string): Promise<void>;
}
