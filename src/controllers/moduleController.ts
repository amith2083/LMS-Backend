import { Request, Response } from "express";
import { IModuleController } from "../interfaces/module/IModuleController";
import { IModuleService } from "../interfaces/module/IModuleService";
import { STATUS_CODES } from "../constants/http";
import { ERROR_MESSAGES } from "../constants/messages";

export class ModuleController implements IModuleController {
  constructor(private moduleService: IModuleService) {}

  async createModule(req: Request, res: Response): Promise<void> {
    const module = await this.moduleService.createModule(req.body);
    res.status(STATUS_CODES.CREATED).json(module);
  }

  async getModule(req: Request, res: Response): Promise<void> {
    const module = await this.moduleService.getModule(req.params.id);
    if (!module) {
      res.status(STATUS_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.NOT_FOUND });
      return;
    }
    res.status(STATUS_CODES.OK).json(module);
  }

  async updateModule(req: Request, res: Response): Promise<void> {
    const updated = await this.moduleService.updateModule(req.params.id, req.body);
    res.status(STATUS_CODES.OK).json(updated);
  }

  async changeModulePublishState(req: Request, res: Response): Promise<void> {
    const status = await this.moduleService.changeModulePublishState(req.params.id);
    res.status(STATUS_CODES.OK).json({ status });
  }

  async deleteModule(req: Request, res: Response): Promise<void> {
    await this.moduleService.deleteModule(req.params.id, req.query.courseId as string);
    res.status(STATUS_CODES.OK).json({ message: "Deleted successfully" });
  }
}
