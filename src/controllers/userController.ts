import { Request, Response } from 'express';
import { STATUS_CODES } from '../constants/http';
import { IUserService } from '../interfaces/user/IUserService';

export class UserController {
  constructor(private userService: IUserService) {}

  getUsers = async (req: Request, res: Response) => {
    const users = await this.userService.getUsers();
    res.status(STATUS_CODES.OK).json(users);
  };

  getUserById = async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id);
    if (!user) return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found' });
    res.status(STATUS_CODES.OK).json(user);
  };

  createUser = async (req: Request, res: Response) => {
    const user = await this.userService.createUser(req.body, req.file);
    res.status(STATUS_CODES.CREATED).json(user);
  };

  updateUser = async (req: Request, res: Response) => {
    const updated = await this.userService.updateUser(req.params.id, req.body);
    res.status(STATUS_CODES.OK).json(updated);
  };

  deleteUser = async (req: Request, res: Response) => {
    await this.userService.deleteUser(req.params.id);
    res.status(STATUS_CODES.OK).json({ message: 'User deleted successfully' });
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const success = await this.userService.verifyOtp(email, otp);
    res.status(STATUS_CODES.OK).json({ success });
  };

  resendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.userService.resendOtp(email);
    res.status(STATUS_CODES.OK).json({ message: 'OTP resent' });
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.userService.forgotPassword(email);
    res.status(STATUS_CODES.OK).json({ message: 'OTP sent for password reset' });
  };

  resetPassword = async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    await this.userService.resetPassword(email, otp, newPassword);
    res.status(STATUS_CODES.OK).json({ message: 'Password reset successfully' });
  };
}