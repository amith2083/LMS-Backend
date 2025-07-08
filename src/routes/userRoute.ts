import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserService } from "../services/userService";
import { UserRepository } from "../repositories/userRepository";
import { OtpService } from "../services/otpService";
import { OtpRepository } from "../repositories/otpRepository";
import { FileUploadService } from "../services/fileUploadService";
import { asyncHandler } from "../utils/asyncHandler";
import { upload } from "../middlewares/upload";

const router = Router();

// Dependency Injection (manual for simplicity; consider using a DI container like InversifyJS)
const userRepo = new UserRepository();
const otpRepo = new OtpRepository();
const fileUploadService = new FileUploadService();
const otpService = new OtpService(otpRepo, userRepo);
const userService = new UserService(userRepo, fileUploadService, otpService);
const userController = new UserController(userService, otpService);

router.get("/", asyncHandler(userController.getUsers));
router.get("/:id", asyncHandler(userController.getUserById));
router.post(
  "/signup",
  upload.single("verificationDocs"),
  asyncHandler(userController.createUser)
);
router.put("/:id", asyncHandler(userController.updateUser));
router.delete("/:id", asyncHandler(userController.deleteUser));
router.post("/verify-otp", asyncHandler(userController.verifyOtp));
router.post("/resend-otp", asyncHandler(userController.resendOtp));
router.post("/forgot-password", asyncHandler(userController.forgotPassword));
router.post("/reset-password", asyncHandler(userController.resetPassword));
router.post("/auth/login", asyncHandler(userController.login));
router.post("/auth/google-sync", asyncHandler(userController.googleSync));

export default router;
