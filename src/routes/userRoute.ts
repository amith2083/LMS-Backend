import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";
import { UserRepository } from "../repositories/userRepository";
import { OtpService } from "../services/otpService";
import { OtpRepository } from "../repositories/otpRepository";
import { FileUploadService } from "../services/fileUploadService";
import { asyncHandler } from "../utils/asyncHandler";
import { upload } from "../middlewares/upload";
import cookieParser from "cookie-parser";
import { csrfProtection, loginRateLimiter, refreshRateLimiter } from "../middlewares/csrf";
import { authenticateToken } from "../middlewares/authenciateToken";

const router = Router();

// Middleware
router.use(cookieParser());

// Dependency Injection
const userRepo = new UserRepository();
const otpRepo = new OtpRepository();
const fileUploadService = new FileUploadService();
const otpService = new OtpService(otpRepo, userRepo);
const userService = new UserService(userRepo, fileUploadService, otpService);
const userController = new UserController(userService, otpService);

// Public routes
router.post("/signup", upload.single("verificationDocs"), csrfProtection, asyncHandler(userController.createUser));
router.post("/verify-otp", csrfProtection, asyncHandler(userController.verifyOtp));
router.post("/resend-otp", csrfProtection, asyncHandler(userController.resendOtp));
router.post("/forgot-password", csrfProtection, asyncHandler(userController.forgotPassword));
router.post("/reset-password", csrfProtection, asyncHandler(userController.resetPassword));
router.post("/auth/login", loginRateLimiter, csrfProtection, asyncHandler(userController.login));
router.post("/auth/google-sync", csrfProtection, asyncHandler(userController.googleSync));
router.post("/auth/refresh-token", refreshRateLimiter, asyncHandler(userController.refreshToken));
router.post("/auth/logout", csrfProtection, asyncHandler(userController.logout));

// Protected routes
router.get("/", asyncHandler(userController.getUsers));
router.get("/:id", asyncHandler(userController.getUserById));
router.put("/:id", authenticateToken, csrfProtection, asyncHandler(userController.updateUser));

export default router;