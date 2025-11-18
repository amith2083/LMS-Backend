
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticateToken } from '../middlewares/authenciateToken';
import { WatchController } from '../controllers/watchController';
import { WatchService } from '../services/watchService';
import { WatchRepository } from '../repositories/watchRespository';
import { ReportService } from '../services/reportService';
import { ReportRepository } from '../repositories/reportRepository';
import { CourseRepository } from '../repositories/courseRepository';
import { ModuleRepository } from '../repositories/moduleRepository';


const router = Router();

const watchRepo = new WatchRepository();
const reportRepo = new ReportRepository();
const courseRepo = new CourseRepository();
const moduleRepo = new ModuleRepository();

const reportService = new ReportService(reportRepo, courseRepo, moduleRepo);
const watchService = new WatchService(watchRepo, reportService);
const watchController = new WatchController(watchService);

router.get('/:lessonId/:moduleId', authenticateToken, asyncHandler(watchController.getWatch.bind(watchController)));
router.post('/', authenticateToken, asyncHandler(watchController.createWatch.bind(watchController)));

export default router;