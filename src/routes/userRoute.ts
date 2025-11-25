
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { upload } from '../middlewares/upload';
import { loginRateLimiter, refreshRateLimiter } from '../middlewares/csrf';
import { authenticateToken } from '../middlewares/authenciateToken';
import cookieParser from 'cookie-parser';

import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';
import { UserRepository } from '../repositories/userRepository';
import { OtpService } from '../services/otpService';
import { OtpRepository } from '../repositories/otpRepository';
import { FileUploadService } from '../services/fileUploadService';

const router = Router();


const userRepo = new UserRepository();
const otpRepo = new OtpRepository();
const fileUploadService = new FileUploadService();
const otpService = new OtpService(otpRepo, userRepo);
const userService = new UserService(userRepo, fileUploadService, otpService);
const userController = new UserController(userService, otpService);

router.post('/signup', upload.single('verificationDocs'), asyncHandler(userController.createUser.bind(userController)));
router.post('/verify-otp', asyncHandler(userController.verifyOtp.bind(userController)));
router.post('/resend-otp', asyncHandler(userController.resendOtp.bind(userController)));
router.post('/forgot-password', asyncHandler(userController.forgotPassword.bind(userController)));
router.post('/reset-password', asyncHandler(userController.resetPassword.bind(userController)));
router.post('/auth/login', loginRateLimiter, asyncHandler(userController.login.bind(userController)));
router.post('/auth/set-tokens', asyncHandler(userController.setTokens.bind(userController)));
router.post('/auth/google-sync', asyncHandler(userController.googleSync.bind(userController)));
router.post('/auth/refresh-token', refreshRateLimiter, asyncHandler(userController.refreshToken.bind(userController)));
router.post('/auth/logout', asyncHandler(userController.logout.bind(userController)));

router.get('/', asyncHandler(userController.getUsers.bind(userController)));
router.get('/:id', authenticateToken, asyncHandler(userController.getUserById.bind(userController)));
router.put('/:id', authenticateToken, asyncHandler(userController.updateUser.bind(userController)));

export default router;