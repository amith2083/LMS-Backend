import { Router } from "express";
import { QuizsetRepository } from "../repositories/quizRepository";
import { QuizsetService } from "../services/quizService";
import { QuizsetController } from "../controllers/quizController";
import { asyncHandler } from "../utils/asyncHandler";


const router = Router();

const quizsetRepo = new QuizsetRepository();
const quizsetService = new QuizsetService(quizsetRepo);
const quizsetController = new QuizsetController(quizsetService);

router.get("/", asyncHandler((req, res) => quizsetController.getQuizsets(req, res)));
router.get("/:id", asyncHandler((req, res) => quizsetController.getQuizsetById(req, res)));
router.post("/", asyncHandler((req, res) => quizsetController.createQuizset(req, res)));
router.put("/:id", asyncHandler((req, res) => quizsetController.updateQuizset(req, res)));
router.delete("/:id", asyncHandler((req, res) => quizsetController.deleteQuizset(req, res)));
router.post("/:id/quiz", asyncHandler((req, res) => quizsetController.addQuizToQuizset(req, res)));
router.delete("/:quizsetId/quiz/:quizId", asyncHandler((req, res) => quizsetController.deleteQuizFromQuizset(req, res)));
router.put("/:id/toggle", asyncHandler((req, res) => quizsetController.togglePublishQuizset(req, res)));

export default router;
