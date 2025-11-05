import { Router } from "express";
import { CourseRepository } from "../repositories/courseRepository";
import { UserRepository } from "../repositories/userRepository";
import { EnrollmentRepository } from "../repositories/enrollmentRepository";
import { EnrollmentService } from "../services/enrollmentService";
import { EnrollmentController } from "../controllers/enrollmentController";
import { authenticateToken } from "../middlewares/authenciateToken";
import { asyncHandler } from "../utils/asyncHandler";


const router = Router();

// Dependency Injection
const courseRepository = new CourseRepository();
const userRepository = new UserRepository();
const enrollmentRepository = new EnrollmentRepository(courseRepository, userRepository);
const enrollmentService = new EnrollmentService(enrollmentRepository, courseRepository, userRepository);
const enrollmentController = new EnrollmentController(enrollmentService);

// Routes
router.post("/", authenticateToken, asyncHandler((req, res) => enrollmentController.createEnrollment(req, res)));
router.post("/confirm", authenticateToken, asyncHandler((req, res) => enrollmentController.confirmEnrollment(req, res)));
router.get("/:id", authenticateToken, asyncHandler((req, res) => enrollmentController.getEnrollment(req, res)));
router.get("/course/:courseId", authenticateToken, asyncHandler((req, res) => enrollmentController.getEnrollmentsForCourse(req, res)));
router.get(
  "/course/:courseId/check",
  
  asyncHandler((req, res) => enrollmentController.hasEnrollmentForCourse(req, res))
);
router.get("/user/me", authenticateToken, asyncHandler((req, res) => enrollmentController.getEnrollmentsForUser(req, res)));



export default router;