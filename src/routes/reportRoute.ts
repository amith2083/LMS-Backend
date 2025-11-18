
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticateToken } from '../middlewares/authenciateToken';
import { ReportController } from '../controllers/reportController';
import { ReportService } from '../services/reportService';
import { ReportRepository } from '../repositories/reportRepository';
import { CourseRepository } from '../repositories/courseRepository';
import { ModuleRepository } from '../repositories/moduleRepository';

const router = Router();

const reportRepo = new ReportRepository();
const courseRepo = new CourseRepository();
const moduleRepo = new ModuleRepository();
const reportService = new ReportService(reportRepo, courseRepo, moduleRepo);
const reportController = new ReportController(reportService);

router.get('/:courseId', authenticateToken, asyncHandler(reportController.getReport.bind(reportController)));
router.post('/', authenticateToken, asyncHandler(reportController.createWatchReport.bind(reportController)));

export default router;