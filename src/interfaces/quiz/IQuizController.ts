import { Request, Response } from "express";

export interface IQuizsetController {
  getQuizsets(req: Request, res: Response): Promise<void>;
  getQuizsetById(req: Request, res: Response): Promise<void>;
  createQuizset(req: Request, res: Response): Promise<void>;
  updateQuizset(req: Request, res: Response): Promise<void>;
  deleteQuizset(req: Request, res: Response): Promise<void>;
  addQuizToQuizset(req: Request, res: Response): Promise<void>;
  deleteQuizFromQuizset(req: Request, res: Response): Promise<void>;
  togglePublishQuizset(req: Request, res: Response): Promise<void>;
}
