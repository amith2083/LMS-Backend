import { Request, Response } from "express";
import { IAssessmentService } from "../interfaces/assessment/IAssessmentService";
import { AppError } from "../utils/asyncHandler";
import { STATUS_CODES } from "../constants/http";

export class AssessmentController {
  constructor(private assessmentService: IAssessmentService) {}

  async submitQuiz(req: Request, res: Response): Promise<void> {
    console.log('ans',req.body)
    // const { quizSetId, answers } = req.body;

    // const { courseId } = req.params;
    //   if (!req.user) {
    //     throw new AppError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized');
    //   }
      
    // const userId = req.user.id;

    // await this.assessmentService.addQuizAssessment(
    //   courseId,
    //   userId,
    //   quizSetId,
    //   answers,
    // );
    // res
    //   .status(201)
    //   .json({ success: true, message: "Quiz submitted successfully" });
  }
}
