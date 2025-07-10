import { IModule } from "../interfaces/module/IModule";
import { IModuleService } from "../interfaces/module/IModuleService";
import { IModuleRepository } from "../interfaces/module/IModuleRepository";
import { Module } from "../models/module";

export class ModuleService implements IModuleService {
  private moduleRepository: IModuleRepository;

  constructor(moduleRepository: IModuleRepository) {
    this.moduleRepository = moduleRepository;
  }

  async createModule(data: Partial<IModule>): Promise<IModule> {
    if (typeof data.order === "string") {
      data.order = parseInt(data.order);
    }
    if (!data.courseId || !data.title) {
      throw new Error("Title and courseId are required");
    }

    const existing = await this.moduleRepository.findByTitleAndCourse(
      data?.title,
      data.courseId
    );
    if (existing) {
      throw new Error("A module with this title already exists in the course.");
    }

    return this.moduleRepository.createModule(data);
  }

  async getModule(moduleId: string): Promise<IModule | null> {
    const module = await this.moduleRepository.getModule(moduleId);
    if (!module) throw new Error("Module not found");
    return module;
  }

  async updateModule(
    moduleId: string,
    data: Partial<IModule>
  ): Promise<IModule | null> {
    return this.moduleRepository.updateModule(moduleId, data);
  }

  // async changeModulePublishState(moduleId: string): Promise<boolean> {
  //   return this.moduleRepository.changeModulePublishState(moduleId);
  // }

  async deleteModule(moduleId: string, courseId: string): Promise<void> {
    return this.moduleRepository.deleteModule(moduleId, courseId);
  }
}
