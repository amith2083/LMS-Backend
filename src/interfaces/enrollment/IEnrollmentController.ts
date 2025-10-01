import { Request, Response } from "express";

export interface IEnrollmentController {
  createEnrollment(req: Request, res: Response): Promise<void>;
   confirmEnrollment(req: Request, res: Response): Promise<void>
  getEnrollment(req: Request, res: Response): Promise<void>;
  getEnrollmentsForCourse(req: Request, res: Response): Promise<void>;
  getEnrollmentsForUser(req: Request, res: Response): Promise<void>;
  updateEnrollment(req: Request, res: Response): Promise<void>;
  deleteEnrollment(req: Request, res: Response): Promise<void>;
}