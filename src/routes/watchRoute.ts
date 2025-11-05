
 import { Router } from "express";
import { WatchRepository } from "../repositories/watchRespository";
import { WatchService } from "../services/watchService";
import { WatchController } from "../controllers/watchController";
import { authenticateToken } from "../middlewares/authenciateToken";
import { asyncHandler } from "../utils/asyncHandler";
import { ReportRepository } from "../repositories/reportRepository";
import { CourseRepository } from "../repositories/courseRepository";
import { ModuleRepository } from "../repositories/moduleRepository";
import { ReportService } from "../services/reportService";


const router = Router();

const watchRepository = new WatchRepository();
const reportRepository = new ReportRepository();
const courseRepository = new CourseRepository();
const moduleRepository = new ModuleRepository();


const reportService = new ReportService(
  reportRepository,
  courseRepository,
  moduleRepository
);

const watchService = new WatchService(
  watchRepository,
  reportService 
);
const watchController = new WatchController(watchService);
router.get("/:lessonId/:moduleId", authenticateToken, asyncHandler((req, res) => watchController.getWatch(req, res)));
router.post("/", authenticateToken, asyncHandler((req, res) => watchController.createWatch(req, res)));


export default router;
