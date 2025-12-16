
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { QuizsetController } from '../controllers/quizController';
import { QuizService } from '../services/quizService';
import { QuizsetRepository } from '../repositories/quizsetRepository';
import { CourseRepository } from '../repositories/courseRepository';
import { QuizRepository } from '../repositories/quizRepository';
import { authenticateToken } from '../middlewares/authenciateToken';

const router = Router();

// DI
const courseRepo = new CourseRepository();
const quizsetRepo = new QuizsetRepository();
const quizRepo = new QuizRepository();
const quizsetService = new QuizService(quizsetRepo, courseRepo,quizRepo);
const quizsetController = new QuizsetController(quizsetService);

// Routes
router.get('/', authenticateToken,asyncHandler(quizsetController.getQuizsets.bind(quizsetController)));
router.get('/:id', asyncHandler(quizsetController.getQuizsetById.bind(quizsetController)));
router.post('/', authenticateToken,asyncHandler(quizsetController.createQuizset.bind(quizsetController)));
router.put('/:id', asyncHandler(quizsetController.updateQuizset.bind(quizsetController)));
router.put('/:id/toggle', asyncHandler(quizsetController.togglePublishQuizset.bind(quizsetController)));
router.delete('/:id', asyncHandler(quizsetController.deleteQuizset.bind(quizsetController)));
//upto quizset operations------------------------------------------------------------------------------------------------------------
router.post('/:id/quiz', asyncHandler(quizsetController.createQuiz.bind(quizsetController)));
router.delete('/:quizsetId/quiz/:quizId', asyncHandler(quizsetController.removeQuizFromQuizset.bind(quizsetController)));


export default router;