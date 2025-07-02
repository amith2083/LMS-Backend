import { Router } from "express";
import { CourseRepository } from "../repositories/courseRepository";
import { CourseService } from "../services/courseService";
import { CourseController } from "../controllers/courseController";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();


const courseRepo = new CourseRepository();
const courseService = new CourseService(courseRepo);
const courseController = new CourseController(courseService);

router.get("/", asyncHandler((req, res) => courseController.getCourses(req, res)));
router.get("/:id", asyncHandler((req, res) => courseController.getCourse(req, res)));
router.post("/", asyncHandler((req, res) => courseController.createCourse(req, res)));
router.put("/:id", asyncHandler((req, res) => courseController.updateCourse(req, res)));
router.delete("/:id", asyncHandler((req, res) => courseController.deleteCourse(req, res)));



export default router;
