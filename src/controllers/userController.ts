import { Request, Response } from "express";
import { IUserController } from "../interfaces/user/IUserController";
import { IUserService } from "../interfaces/user/IUserService";
import { IOtpService } from "../interfaces/otp/IOtpService";
import { STATUS_CODES } from "../constants/http";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utils/asyncHandler";
import { IUser } from "../types/IUser";
import { redisClient } from "../config/redis";

export class UserController implements IUserController {
  constructor(
    private userService: IUserService,
    private otpService: IOtpService
  ) {}

  getUsers = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getUsers();
    res.json(users);
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.getUserById(req.params.id);
    if (!user) throw new AppError(STATUS_CODES.NOT_FOUND, "User not found");
    res.json(user);
  };

  createUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name, role } = req.body;
    if (!email || !password) {
      throw new AppError(
        STATUS_CODES.BAD_REQUEST,
        "Email and password are required"
      );
    }
    const userData: Partial<IUser> = {
      email,
      password,
      name,
      role,
    };
    const result = await this.userService.createUser(userData, req.file);
    res.status(STATUS_CODES.CREATED).json(result);
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updated = await this.userService.updateUser(id, req.body);
    res.json(updated);
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    await this.otpService.verifyOtp(email, otp);
    res.json({
      success: true,
      message: "OTP verified. Registration complete.",
    });
  };

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await this.otpService.resendOtp(email);
    res.json({ message: "OTP resent" });
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await this.otpService.forgotPassword(email);
    res.json({ message: "OTP sent for password reset" });
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, otp, newPassword } = req.body;
    await this.otpService.resetPassword(email, otp, newPassword);
    res.json({ message: "Password reset successfully" });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError(
        STATUS_CODES.BAD_REQUEST,
        "Email and password are required"
      );
    }
    const user = await this.userService.login(email, password);
   if (!user) throw new AppError(STATUS_CODES.BAD_REQUEST, 'Invalid credentials');
    // const accessToken = jwt.sign(
    //   { id: user._id, email: user.email, role: user.role },
    //   process.env.JWT_ACCESS_SECRET!,
    //   { expiresIn: '50m' }
    // );

    // const refreshToken = jwt.sign(
    //   { id: user._id, jti: uuidv4() },
    //   process.env.JWT_REFRESH_SECRET!,
    //   { expiresIn: '7d' }
    // );

    // res.cookie('accessToken', accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: 50 * 60 * 1000,
    // });

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      profilePicture: user.profilePicture,
    });
  };

  setTokens = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new AppError(STATUS_CODES.NOT_FOUND, "User not found");
    }
  const jti = uuidv4();
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, jti },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "1d" }
    );

      // Store refresh token in Redis with TTL
  await redisClient.set(`refresh:${jti}`, user._id.toString(), {
    EX: 60 * 60 * 24,
  });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Tokens set" });
  };

  googleSync = async (req: Request, res: Response): Promise<void> => {
    const { email, name, image } = req.body;
    const user = await this.userService.googleSync(email, name, image);
     if (!user) throw new AppError(STATUS_CODES.BAD_REQUEST, 'Invalid credentials');

    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
    });
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      throw new AppError(STATUS_CODES.UNAUTHORIZED, "Refresh token required");

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: string; jti: string };
    // if (await this.userService.checkTokenReuse(decoded.jti)) {
    //   throw new AppError(STATUS_CODES.UNAUTHORIZED, "Token reused");
    // }

    // await this.userService.markTokenAsUsed(decoded.jti);
//  Check if token exists in Redis
  const stored = await redisClient.get(`refresh:${decoded.jti}`);
 
  if (!stored) {
    throw new AppError(
      STATUS_CODES.UNAUTHORIZED,
      "Invalid or reused refresh token"
    );
  }

  //  Delete old refresh token (rotation)
  await redisClient.del(`refresh:${decoded.jti}`);
    const user = await this.userService.getUserById(decoded.id);
    if (!user) {
      throw new AppError(STATUS_CODES.UNAUTHORIZED, "User not found");
    }

     const newJti = uuidv4();
    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "30m" }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id, jti: newJti },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "1d" }
    );

     //  Store new refresh token
  await redisClient.set(`refresh:${newJti}`, user._id, {
    EX: 60 * 60 * 24,
  });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Tokens refreshed" });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET!
        ) as { jti: string };
        // await this.userService.markTokenAsUsed(decoded.jti);
           await redisClient.del(`refresh:${decoded.jti}`);
      } catch {}
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.json({ message: "Logged out" });
  };
}
