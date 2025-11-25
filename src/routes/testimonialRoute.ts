import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticateToken } from '../middlewares/authenciateToken';
import { TestimonialController } from '../controllers/testimonialController';
import { TestimonialService } from '../services/testimonialService';
import { TestimonialRepository } from '../repositories/testimonialRepository';
import { CourseRepository } from '../repositories/courseRepository';

const router = Router();

const testimonialRepo = new TestimonialRepository();
const courseRepo = new CourseRepository();

const testimonialService = new TestimonialService(testimonialRepo, courseRepo);
const testimonialController = new TestimonialController(testimonialService);

router.post(
  '/:courseId',
  authenticateToken,
  asyncHandler(testimonialController.createTestimonial.bind(testimonialController))
);

export default router;