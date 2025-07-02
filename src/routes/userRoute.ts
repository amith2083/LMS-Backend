import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';
import { UserRepository } from '../repositories/userRepository';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

router.get('/', asyncHandler(userController.getUsers));
router.get('/:id', asyncHandler(userController.getUserById));
router.post('/', asyncHandler(userController.createUser));
router.put('/:id', asyncHandler(userController.updateUser));
router.delete('/:id', asyncHandler(userController.deleteUser));
router.post('/verify-otp', asyncHandler(userController.verifyOtp));
router.post('/resend-otp', asyncHandler(userController.resendOtp));
router.post('/forgot-password', asyncHandler(userController.forgotPassword));
router.post('/reset-password', asyncHandler(userController.resetPassword));

export default router;