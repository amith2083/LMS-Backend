// routes/certificate.ts
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticateToken } from '../middlewares/authenciateToken';
import { CourseRepository } from '../repositories/courseRepository';
import { UserRepository } from '../repositories/userRepository';
import { CertificateService } from '../services/certificateService';
import { ReportRepository } from '../repositories/reportRepository';
import { CertificateController } from '../controllers/certificateController';

const router = Router();
// DI
const courseRepo = new CourseRepository();
const reportRepo = new ReportRepository();
const userRepo = new UserRepository();
const certificateService = new CertificateService(courseRepo,reportRepo,userRepo);
const certificateController = new CertificateController(certificateService);

router.get(
  '/:courseId',
 authenticateToken, 
  asyncHandler(certificateController.generateCertificate.bind(certificateController))
);

export default router;