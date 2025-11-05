import { Request, Response } from "express";
import { STATUS_CODES } from "../constants/http";
import { IUserService } from "../interfaces/user/IUserService";
import { IUserController } from "../interfaces/user/IUserController";
import { AppError } from "../utils/asyncHandler";
import { IOtpService } from "../interfaces/otp/IOtpService";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

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
    const result = await this.userService.createUser(req.body, req.file);
    res.status(STATUS_CODES.CREATED).json(result);
  };

  updateUser = async (req: Request, res: Response) => {
    const updated = await this.userService.updateUser(req.params.id, req.body);
    if (!updated) throw new AppError(STATUS_CODES.NOT_FOUND, "User not found");
    res.status(STATUS_CODES.OK).json(updated);
  };

  verifyOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const success = await this.otpService.verifyOtp(email, otp);
    res
      .status(STATUS_CODES.OK)
      .json({ success, message: "OTP verified successfully. Registration complete." });
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

//     // Generate tokens
//     const accessToken = jwt.sign(
//       { id: user._id, email: user.email, role: user.role },
//       process.env.JWT_ACCESS_SECRET as string,
//       { expiresIn: "50m" }
//     );
  
//     const refreshToken = jwt.sign(
//       { id: user._id, email: user.email, jti: uuidv4(), rotatedAt: Date.now() },
//       process.env.JWT_REFRESH_SECRET as string,
//       { expiresIn: "1d" }
//     );
// console.log('=======',accessToken,refreshToken)
//     // Set tokens in HttpOnly cookies
//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 50 * 60 * 1000, // 15 minutes
//     });
//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 1 * 24 * 60 * 60 * 1000, 
//     });

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
setTokens = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) throw new AppError(400, "Email required");

  const user = await this.userService.getUserByEmail(email);
  if (!user) throw new AppError(404, "User not found");

  // Generate tokens
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "50m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, jti: uuidv4() },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  // Set HttpOnly cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 50 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Tokens set" });
};
  googleSync = async (req: Request, res: Response) => {
    const { email, name, image } = req.body;
    const user = await this.userService.googleSync(email, name, image);

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: "50m" }
    );
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, jti: uuidv4(), rotatedAt: Date.now() },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "1d" }
    );

    // Set tokens in HttpOnly cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 50 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.status(STATUS_CODES.OK).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
    
    });
  };

  refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    console.log('refresh',refreshToken)
    if (!refreshToken) {
      throw new AppError(STATUS_CODES.UNAUTHORIZED, "Refresh token is required");
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as {
        id: string;
        email: string;
        jti: string;
        rotatedAt: number;
      };

      // Check if token was reused (optional: maintain a cache of used jtis)
      const isTokenReused = await this.userService.checkTokenReuse(decoded.jti);
      if (isTokenReused) {
        throw new AppError(STATUS_CODES.UNAUTHORIZED, "Refresh token reused");
      }

      // Mark old refresh token as used
      await this.userService.markTokenAsUsed(decoded.jti);

      // Generate new access and refresh tokens
      const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: (await this.userService.getUserById(decoded.id))?.role },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: "50m" }
      );
      const newRefreshToken = jwt.sign(
        { id: decoded.id, email: decoded.email, jti: uuidv4(), rotatedAt: Date.now() },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: "1d" }
      );

      // Set new tokens in cookies
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 50 * 60 * 1000,
      });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });

      res.status(STATUS_CODES.OK).json({ message: "Tokens refreshed" });
    } catch (error) {
      throw new AppError(STATUS_CODES.UNAUTHORIZED, "Invalid or expired refresh token");
    }
  };

  logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { jti: string };
        await this.userService.markTokenAsUsed(decoded.jti);
      } catch (error) {
        // Ignore invalid token errors during logout
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(STATUS_CODES.OK).json({ message: "Logged out successfully" });
  };
}