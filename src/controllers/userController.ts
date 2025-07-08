import { Request, Response } from "express";
import { STATUS_CODES } from "../constants/http";
import { IUserService } from "../interfaces/user/IUserService";
import { IUserController } from "../interfaces/user/IUserController";
import { AppError } from "../utils/asyncHandler";
import { IOtpService } from "../interfaces/otp/IOtpService";

export class UserController implements IUserController {
  constructor(
    private userService: IUserService,
    private otpService: IOtpService
  ) {}

  getUsers = async (req: Request, res: Response) => {
    const users = await this.userService.getUsers();
    res.status(STATUS_CODES.OK).json(users);
  };

  getUserById = async (req: Request, res: Response) => {
    const user = await this.userService.getUserById(req.params.id);
    if (!user) throw new AppError(STATUS_CODES.NOT_FOUND, "User not found");
    res.status(STATUS_CODES.OK).json(user);
  };

  createUser = async (req: Request, res: Response) => {
    const user = await this.userService.createUser(req.body, req.file);
    res.status(STATUS_CODES.CREATED).json(user);
  };

  updateUser = async (req: Request, res: Response) => {
    const updated = await this.userService.updateUser(req.params.id, req.body);
    if (!updated) throw new AppError(STATUS_CODES.NOT_FOUND, "User not found");
    res.status(STATUS_CODES.OK).json(updated);
  };

  deleteUser = async (req: Request, res: Response) => {
    await this.userService.deleteUser(req.params.id);
    res.status(STATUS_CODES.OK).json({ message: "User deleted successfully" });
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const success = await this.otpService.verifyOtp(email, otp);
    res
      .status(STATUS_CODES.OK)
      .json({ success, message: "OTP verified successfully" });
  };

  resendOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.otpService.resendOtp(email);
    res.status(STATUS_CODES.OK).json({ message: "OTP resent" });
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    await this.otpService.forgotPassword(email);
    res
      .status(STATUS_CODES.OK)
      .json({ message: "OTP sent for password reset" });
  };

  resetPassword = async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    await this.otpService.resetPassword(email, otp, newPassword);
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Password reset successfully" });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await this.userService.login(email, password);
    res.status(STATUS_CODES.OK).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      profilePicture: user.profilePicture,
    });
  };

  googleSync = async (req: Request, res: Response) => {
    const { email, name, image } = req.body;
    const user = await this.userService.googleSync(email, name, image);
    res.status(STATUS_CODES.OK).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
    });
  };
}
