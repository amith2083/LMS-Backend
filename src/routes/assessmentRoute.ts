
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticateToken } from "../middlewares/authenciateToken";
import { AssessmentRepository } from "../repositories/assessmentRepository";
import { QuizsetRepository } from "../repositories/quizsetRepository";
import { ReportRepository } from "../repositories/reportRepository";
import { AssessmentService } from "../services/assessmentService";
import { AssessmentController } from "../controllers/assessmentController";



const router = Router();

const assessmentRepo = new AssessmentRepository();
const quizRepo = new QuizsetRepository();
const reportRepo = new ReportRepository();

const assessmentService = new AssessmentService(assessmentRepo, quizRepo, reportRepo);
const assessmentController = new AssessmentController(assessmentService);

router.post(
  "/:courseId/submit",
  authenticateToken,
  asyncHandler(assessmentController.submitQuiz.bind(assessmentController))
);

export default router;