import { Request, Response } from 'express';
import { IModuleController } from '../interfaces/module/IModuleController';
import { IModuleService } from '../interfaces/module/IModuleService';
import { STATUS_CODES } from '../constants/http';

export class ModuleController implements IModuleController {
  constructor(private moduleService: IModuleService) {}

  async createModule(req: Request, res: Response): Promise<void> {
  const{title,courseId,order}=req.body
    const module = await this.moduleService.createModule({title,courseId,order});
    res.status(STATUS_CODES.CREATED).json(module);
  }

  async getModule(req: Request, res: Response): Promise<void> {
    const module = await this.moduleService.getModule(req.params.id);
    res.json(module); // ← Service throws 404
  }

  async updateModule(req: Request, res: Response): Promise<void> {
    const updated = await this.moduleService.updateModule(req.params.id, req.body);
    res.json(updated);
  }

  async deleteModule(req: Request, res: Response): Promise<void> {
    await this.moduleService.deleteModule(req.params.id, req.query.courseId as string);
    res.json({ message: 'Module deleted successfully' });
  }
}