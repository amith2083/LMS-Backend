// src/routes/enrollmentRoute.ts
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticateToken } from '../middlewares/authenciateToken';
import { EnrollmentController } from '../controllers/enrollmentController';
import { EnrollmentService } from '../services/enrollmentService';
import { EnrollmentRepository } from '../repositories/enrollmentRepository';
import { CourseRepository } from '../repositories/courseRepository';
import { UserRepository } from '../repositories/userRepository';
import { PayoutRepository } from '../repositories/payoutRepository';

const router = Router();

// DI
const courseRepo = new CourseRepository();
const userRepo = new UserRepository();
const payoutRepo = new PayoutRepository();
const enrollmentRepo = new EnrollmentRepository(courseRepo, userRepo);
const enrollmentService = new EnrollmentService(enrollmentRepo, courseRepo, userRepo,payoutRepo);
const enrollmentController = new EnrollmentController(enrollmentService);

// Routes
router.post('/', authenticateToken, asyncHandler(enrollmentController.createEnrollment.bind(enrollmentController)));
router.post('/confirm', authenticateToken, asyncHandler(enrollmentController.confirmEnrollment.bind(enrollmentController)));
router.get('/', authenticateToken, asyncHandler(enrollmentController.getAllEnrollments.bind(enrollmentController)));
router.get('/:id', authenticateToken, asyncHandler(enrollmentController.getEnrollment.bind(enrollmentController)));
router.get('/course/:courseId', authenticateToken, asyncHandler(enrollmentController.getEnrollmentsForCourse.bind(enrollmentController)));
router.get('/course/:courseId/check', authenticateToken, asyncHandler(enrollmentController.hasEnrollmentForCourse.bind(enrollmentController)));
router.get('/user/me', authenticateToken, asyncHandler(enrollmentController.getEnrollmentsForUser.bind(enrollmentController)));

export default router;