import { IOtpService } from "../interfaces/otp/IOtpService";
import { IOtpRepository } from "../interfaces/otp/IOtpRepository";
import { AppError } from "../utils/asyncHandler";
import { sendOtpEmail } from "../utils/sendOtpEmail";
import { UserRepository } from "../repositories/userRepository";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces/user/IUser";

export class OtpService implements IOtpService {
  constructor(
    private otpRepository: IOtpRepository,
    private userRepository: UserRepository
  ) {}

  private generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  }

  async sendOtp(
    email: string,
    purpose: "verification" | "reset",
    userData?: Partial<IUser>
  ): Promise<void> {
    if (purpose === "reset") {
      const user = await this.userRepository.getUserByEmail(email);
      if (!user) throw new AppError(404, "User not found");
    } else if (purpose === "verification") {
      if (!userData) throw new AppError(400, "User data required for registration verification");
      const existingUser = await this.userRepository.getUserByEmail(email);
      if (existingUser) throw new AppError(400, "This email is already registered.");
    }

    const otp = this.generateOtp();
    const expiresAt =
      Date.now() + (purpose === "verification" ? 5 : 2) * 60 * 1000; // 5 min for verification, 2 for reset
    await this.otpRepository.saveOtp(email, otp, expiresAt, purpose, userData);
    await sendOtpEmail(email, otp);
  }

  async verifyOtp(email: string, otp: number): Promise<boolean> {
    const otpDoc = await this.otpRepository.getOtpByEmail(email);
    if (!otpDoc) throw new AppError(404, "OTP not found or expired. Please register again.");
    if (Date.now() > otpDoc.expiresAt)
      throw new AppError(400, "OTP has expired. Please register again.");
    if (otpDoc.otp !== otp) throw new AppError(400, "Invalid OTP");
    if (otpDoc.purpose !== "verification") throw new AppError(400, "Invalid OTP purpose");

    if (otpDoc.userData) {
      const userDataWithVerified = { ...otpDoc.userData, isEmailVerified: true };
      await this.userRepository.createUser(userDataWithVerified);
    }

    await this.otpRepository.deleteOtp(email);
    return true;
  }

  async resendOtp(email: string): Promise<void> {
    const otpDoc = await this.otpRepository.getOtpByEmail(email);
    if (!otpDoc || otpDoc.purpose !== "verification") {
      throw new AppError(404, "No pending registration found. Please register again.");
    }
    await this.sendOtp(email, "verification", otpDoc.userData);
  }

  async forgotPassword(email: string): Promise<void> {
    await this.sendOtp(email, "reset");
  }

  async resetPassword(
    email: string,
    otp: number,
    newPassword: string
  ): Promise<void> {
    const otpDoc = await this.otpRepository.getOtpByEmail(email);
    if (!otpDoc) throw new AppError(404, "OTP not found");
    if (Date.now() > otpDoc.expiresAt)
      throw new AppError(400, "OTP has expired");
    if (otpDoc.otp !== otp) throw new AppError(400, "Invalid OTP");
    if (otpDoc.purpose !== "reset") throw new AppError(400, "Invalid OTP purpose");

    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new AppError(404, "User not found");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updateUser(user._id.toString(), {
      password: hashedPassword,
    });
    await this.otpRepository.deleteOtp(email);
  }
}