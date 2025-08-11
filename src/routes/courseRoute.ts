import { Router } from "express";
import { CourseRepository } from "../repositories/courseRepository";
import { CourseService } from "../services/courseService";
import { CourseController } from "../controllers/courseController";
import { asyncHandler } from "../utils/asyncHandler";
import { FileUploadService } from "../services/fileUploadService";
import { upload } from "../middlewares/upload";

const router = Router();


// const courseRepo = new CourseRepository();
// const courseService = new CourseService(courseRepo);
// const courseController = new CourseController(courseService);
const courseRepo = new CourseRepository();
const fileUploadService = new FileUploadService();
const courseService = new CourseService(courseRepo, fileUploadService);
const courseController = new CourseController(courseService);

router.get("/", asyncHandler((req, res) => courseController.getCourses(req, res)));
router.get("/:id", asyncHandler((req, res) => courseController.getCourse(req, res)));
router.post("/", asyncHandler((req, res) => courseController.createCourse(req, res)));
router.put("/:id", asyncHandler((req, res) => courseController.updateCourse(req, res)));
router.put("/:id/image",upload.single("image"),asyncHandler((req, res) => courseController.updateCourseImage(req, res)));
router.delete("/:id", asyncHandler((req, res) => courseController.deleteCourse(req, res)));



export default router;