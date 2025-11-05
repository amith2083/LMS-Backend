import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";

import { ReportService } from "../services/reportService";
import { ReportController } from "../controllers/reportController";
import { ReportRepository } from "../repositories/reportRepository";
import { CourseRepository } from "../repositories/courseRepository";
import { ModuleRepository } from "../repositories/moduleRepository";
import { authenticateToken } from "../middlewares/authenciateToken";

const router = Router();

const reportRepository = new ReportRepository();
const courseRepository = new CourseRepository();
const moduleRepository = new ModuleRepository();
const reportService = new ReportService(
  reportRepository,
  courseRepository,
  moduleRepository
);
const reportController = new ReportController(reportService);

router.get("/:courseId",authenticateToken, asyncHandler((req, res) => reportController.getReport(req, res)));
router.post("/",authenticateToken, asyncHandler((req, res) => reportController.createWatchReport(req, res)));

export default router;
