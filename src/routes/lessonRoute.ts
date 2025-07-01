import { Router } from "express";

import { LessonController } from "../controllers/lessonController";
import { asyncHandler } from "../utils/asyncHandler";
import { LessonService } from "../services/lessonService";
import { LessonRepository } from "../repositories/lessonRepository";

const router = Router();

// Dependency Injection
const lessonRepo = new LessonRepository();
const lessonService = new LessonService(lessonRepo);
const lessonController = new LessonController(lessonService);

// Routes
router.post("/", asyncHandler((req, res) => lessonController.createLesson(req, res))); // moduleId in query
router.get("/:id", asyncHandler((req, res) => lessonController.getLesson(req, res)));
router.put("/:id", asyncHandler((req, res) => lessonController.updateLesson(req, res)));
router.patch("/:id/publish", asyncHandler((req, res) => lessonController.changeLessonPublishState(req, res)));
router.delete("/:id", asyncHandler((req, res) => lessonController.deleteLesson(req, res))); // moduleId in query

export default router;
