import { Request, Response } from "express";

export interface IEnrollmentController {
  createEnrollment(req: Request, res: Response): Promise<void>;
  getAllEnrollments(req: Request, res: Response): Promise<void>;
  getEnrollment(req: Request, res: Response): Promise<void>;
  getEnrollmentsForCourse(req: Request, res: Response): Promise<void>;
  getEnrollmentsForUser(req: Request, res: Response): Promise<void>;
  hasEnrollmentForCourse(req: Request, res: Response): Promise<void>;
}
