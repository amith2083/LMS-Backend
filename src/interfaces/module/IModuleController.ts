import { Request, Response } from "express";

export interface IModuleController {
  createModule(req: Request, res: Response): Promise<void>;
  getModule(req: Request, res: Response): Promise<void>;
  updateModule(req: Request, res: Response): Promise<void>;
  changeModulePublishState(req: Request, res: Response): Promise<void>;
  deleteModule(req: Request, res: Response): Promise<void>;
}
