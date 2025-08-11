import { Request, Response } from "express";

export interface ICourseController {
  getCourses(req: Request, res: Response): Promise<void>;
  getCourse(req: Request, res: Response): Promise<void>;
  createCourse(req: Request, res: Response): Promise<void>;
  updateCourse(req: Request, res: Response): Promise<void>;
  deleteCourse(req: Request, res: Response): Promise<void>;
}