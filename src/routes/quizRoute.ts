
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { QuizsetController } from '../controllers/quizController';
import { QuizsetService } from '../services/quizService';
import { QuizsetRepository } from '../repositories/quizRepository';
import { CourseRepository } from '../repositories/courseRepository';

const router = Router();

// DI
const courseRepo = new CourseRepository();
const quizsetRepo = new QuizsetRepository();
const quizsetService = new QuizsetService(quizsetRepo, courseRepo);
const quizsetController = new QuizsetController(quizsetService);

// Routes
router.get('/', asyncHandler(quizsetController.getQuizsets.bind(quizsetController)));
router.get('/:id', asyncHandler(quizsetController.getQuizsetById.bind(quizsetController)));
router.post('/', asyncHandler(quizsetController.createQuizset.bind(quizsetController)));
router.put('/:id', asyncHandler(quizsetController.updateQuizset.bind(quizsetController)));
router.delete('/:id', asyncHandler(quizsetController.deleteQuizset.bind(quizsetController)));
router.post('/:id/quiz', asyncHandler(quizsetController.addQuizToQuizset.bind(quizsetController)));
router.delete('/:quizsetId/quiz/:quizId', asyncHandler(quizsetController.deleteQuizFromQuizset.bind(quizsetController)));
router.put('/:id/toggle', asyncHandler(quizsetController.togglePublishQuizset.bind(quizsetController)));

export default router;