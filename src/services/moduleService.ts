// src/services/moduleService.ts
import { AppError } from '../utils/asyncHandler';
import { IModule } from '../interfaces/module/IModule';
import { IModuleRepository } from '../interfaces/module/IModuleRepository';
import { IModuleService } from '../interfaces/module/IModuleService';


export class ModuleService implements IModuleService {
  constructor(private moduleRepository: IModuleRepository) {}

  async createModule(data: Partial<IModule>): Promise<IModule> {
    if (!data.title || !data.courseId) {
      throw new AppError(400, 'Title and courseId are required');
    }

    if (typeof data.order === 'string') {
      data.order = parseInt(data.order, 10);
    }

    const existing = await this.moduleRepository.findByTitleAndCourse(data.title, data.courseId);
    if (existing) {
      throw new AppError(409, 'A module with this title already exists in the course.');
    }

    return this.moduleRepository.createModule(data);
  }

  async getModule(moduleId: string): Promise<IModule> {
    const module = await this.moduleRepository.getModule(moduleId);
    if (!module) throw new AppError(404, 'Module not found');
    return module;
  }

  async updateModule(moduleId: string, data: Partial<IModule>): Promise<IModule> {
    const updated = await this.moduleRepository.updateModule(moduleId, data);
    if (!updated) throw new AppError(404, 'Module not found');
    return updated;
  }

  async deleteModule(moduleId: string, courseId: string): Promise<void> {
    await this.moduleRepository.deleteModule(moduleId, courseId);
  }
}