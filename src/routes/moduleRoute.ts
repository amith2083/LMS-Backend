import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ModuleController } from "../controllers/moduleController";
import { ModuleService } from "../services/moduleService";
import { ModuleRepository } from "../repositories/moduleRepository";
import { CourseRepository } from "../repositories/courseRepository";

const router = Router();

// DI
const moduleRepo = new ModuleRepository();
const courseRepo = new CourseRepository();
const moduleService = new ModuleService(moduleRepo, courseRepo);
const moduleController = new ModuleController(moduleService);

// Routes
router.post(
  "/",
  asyncHandler(moduleController.createModule.bind(moduleController))
);
router.get(
  "/:id",
  asyncHandler(moduleController.getModule.bind(moduleController))
);
router.put(
  "/:id",
  asyncHandler(moduleController.updateModule.bind(moduleController))
);
router.delete(
  "/:id",
  asyncHandler(moduleController.deleteModule.bind(moduleController))
);

export default router;
