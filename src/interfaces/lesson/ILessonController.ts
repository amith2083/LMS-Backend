import { Request, Response } from "express";

export interface ILessonController {
  createLesson(req: Request, res: Response): Promise<void>;
  getLesson(req: Request, res: Response): Promise<void>;
  updateLesson(req: Request, res: Response): Promise<void>;
  changeLessonPublishState(req: Request, res: Response): Promise<void>;
  deleteLesson(req: Request, res: Response): Promise<void>;
}
