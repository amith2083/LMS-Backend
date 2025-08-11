import { IUserService } from "../interfaces/user/IUserService";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { IFileUploadService } from "../interfaces/file/IFileUploadService";
import { IOtpService } from "../interfaces/otp/IOtpService";
import { IUser } from "../interfaces/user/IUser";
import { AppError } from "../utils/asyncHandler";
import bcrypt from "bcrypt";
import { Express } from "express";

// Simple in-memory cache for used jtis 
const usedJtis: Set<string> = new Set();

export class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private fileUploadService: IFileUploadService,
    private otpService: IOtpService
  ) {}

  async getUsers(): Promise<IUser[]> {
    return this.userRepository.getUsers();
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return this.userRepository.getUserById(userId);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.getUserByEmail(email);
  }

  // async createUser(
  //   data: Partial<IUser>,
  //   verificationDoc?: Express.Multer.File
  // ): Promise<IUser> {
  //   const existing = await this.userRepository.getUserByEmail(data.email!);
  //   if (existing) throw new AppError(400, "This email is already registered.");

  //   if (data.password) {
  //     data.password = await bcrypt.hash(data.password, 10);
  //   }

  //   let docUrl: string | undefined;
  //   if (verificationDoc) {
  //     docUrl = await this.fileUploadService.uploadFile(
  //       verificationDoc,
  //       "verification-docs"
  //     );
  //   }

  //   const userData: Partial<IUser> = {
  //     ...data,
  //     isVerified: data.role === "instructor" ? false : true,
  //     isEmailVerified: false, // Require email verification for all
  //     doc: docUrl,
  //   };

  //   const user = await this.userRepository.createUser(userData);
  //   if (user) {
  //     await this.otpService.sendOtp(user.email, "verification");
  //   }
  //   return user;
  // }
async createUser(
    data: Partial<IUser>,
    verificationDoc?: Express.Multer.File
  ): Promise<{ message: string }> {
    const existing = await this.userRepository.getUserByEmail(data.email!);
    if (existing) throw new AppError(400, "This email is already registered.");

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    let docUrl: string | undefined;
    if (verificationDoc) {
      docUrl = await this.fileUploadService.uploadFile(
        verificationDoc,
        "verification-docs"
      );
    }

    const userData: Partial<IUser> = {
      ...data,
      isVerified: data.role === "instructor" ? false : true,
      isEmailVerified: false, // Will be set to true on verification
      doc: docUrl,
    };

    await this.otpService.sendOtp(data.email!, "verification", userData);
    return { message: "OTP sent for verification" };
  }
  async updateUser(
    userId: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.userRepository.updateUser(userId, data);
  }

  async login(email: string, password: string): Promise<IUser> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user || !user.password) throw new AppError(400, "Invalid credentials");
    if (user.isBlocked) {
      throw new AppError(403, "Your account has been blocked by the admin.");
    }
    if (!user.isEmailVerified) {
    await this.otpService.resendOtp(email); // Resend OTP
    throw new AppError(
      403,
      "Your email is not verified. A new OTP has been sent to your email."
    );
  }
    if (user.role === "instructor" && !user.isVerified) {
      throw new AppError(
        403,
        "Your instructor account has not been approved by the admin."
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError(400, "Invalid credentials");

    return user;
  }

  async googleSync(email: string, name: string, image: string): Promise<IUser> {
    let user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      user = await this.userRepository.createUser({
        email,
        name,
        profilePicture: image,
        isGoogleUser: true,
        isVerified: true,
      });
    } else if (!user.isGoogleUser) {
      user = await this.userRepository.updateUser(user._id.toString(), {
        isGoogleUser: true,
        profilePicture: image,
      });
    }

    return user!;
  }

  async checkTokenReuse(jti: string): Promise<boolean> {
    return usedJtis.has(jti);
  }

  async markTokenAsUsed(jti: string): Promise<void> {
    usedJtis.add(jti);
    // Optional: Clean up old jtis periodically to prevent memory leaks
  }
}