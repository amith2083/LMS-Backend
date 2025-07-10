import { Router } from "express";

import { LessonController } from "../controllers/lessonController";
import { asyncHandler } from "../utils/asyncHandler";
import { LessonService } from "../services/lessonService";
import { LessonRepository } from "../repositories/lessonRepository";
import { ModuleRepository } from "../repositories/moduleRepository";

const router = Router();

// Dependency Injection
const lessonRepo = new LessonRepository();
const moduleRepo = new ModuleRepository();
const lessonService = new LessonService(lessonRepo,moduleRepo);
const lessonController = new LessonController(lessonService);

// Routes
router.post("/", asyncHandler((req, res) => lessonController.createLesson(req, res))); 
router.get("/:id", asyncHandler((req, res) => lessonController.getLesson(req, res)));
router.put("/:id", asyncHandler((req, res) => lessonController.updateLesson(req, res)));
// router.patch("/:id/publish", asyncHandler((req, res) => lessonController.changeLessonPublishState(req, res)));
router.delete("/:id", asyncHandler((req, res) => lessonController.deleteLesson(req, res)));
// router.post("/", asyncHandler((req, res) => lessonController.createLesson(req, res)));
// router.get("/:id", asyncHandler((req, res) => lessonController.getLesson(req, res)));

export default router;
