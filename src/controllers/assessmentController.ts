
import { Request, Response } from "express";
import { IAssessmentService } from "../interfaces/assessment/IAssessmentService";


export class AssessmentController {
  constructor(private assessmentService: IAssessmentService) {}

  async submitQuiz (req: Request, res: Response): Promise<void>  {
    const { quizSetId, answers } = req.body;

    const { courseId } = req.params;
    console.log('assssss',quizSetId,answers,courseId)
    const userId = req.user .id;

    await this.assessmentService.addQuizAssessment(courseId, userId, quizSetId, answers);
    res.status(201).json({ success: true, message: "Quiz submitted successfully" });
  };
}
