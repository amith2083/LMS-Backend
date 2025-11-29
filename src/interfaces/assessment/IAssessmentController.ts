import { Request, Response } from "express";

export interface IAssessmentController {
 submitQuiz (req: Request, res: Response): Promise<void>
}