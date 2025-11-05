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
import { loginRateLimiter, refreshRateLimiter } from "../middlewares/csrf";
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
router.post("/signup", upload.single("verificationDocs"),  asyncHandler(userController.createUser));
router.post("/verify-otp",  asyncHandler(userController.verifyOtp));
router.post("/resend-otp",  asyncHandler(userController.resendOtp));
router.post("/forgot-password",  asyncHandler(userController.forgotPassword));
router.post("/reset-password",  asyncHandler(userController.resetPassword));
router.post("/auth/login", loginRateLimiter,  asyncHandler(userController.login));
router.post("/auth/set-tokens", asyncHandler(userController.setTokens));
router.post("/auth/google-sync",  asyncHandler(userController.googleSync));
router.post("/auth/refresh-token", refreshRateLimiter, asyncHandler(userController.refreshToken));
router.post("/auth/logout",  asyncHandler(userController.logout));

// Protected routes
router.get("/", asyncHandler(userController.getUsers));
router.get("/:id",authenticateToken, asyncHandler(userController.getUserById));
router.put("/:id", authenticateToken,  asyncHandler(userController.updateUser));

export default router;