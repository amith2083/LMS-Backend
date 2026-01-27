import { AppError } from "../utils/asyncHandler";
import { IOtpRepository } from "../interfaces/otp/IOtpRepository";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { sendOtpEmail } from "../utils/sendOtpEmail";
import bcrypt from "bcrypt";
import { STATUS_CODES } from "../constants/http";
import { IOtpService } from "../interfaces/otp/IOtpService";

export class OtpService implements IOtpService {
  constructor(
    private otpRepository: IOtpRepository,
    private userRepository: IUserRepository,
  ) {}

  private generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  async sendOtp(
    email: string,
    purpose: "verification" | "reset",
  ): Promise<void> {
    if (purpose === "reset") {
      const user = await this.userRepository.getUserByEmail(email);
      if (!user) throw new AppError(STATUS_CODES.NOT_FOUND, "User not found");
    }

    const otp = this.generateOtp();
    const expiresAt =
      Date.now() + (purpose === "verification" ? 5 : 2) * 60 * 1000;
    await this.otpRepository.saveOtp(email, otp, expiresAt, purpose);
    await sendOtpEmail(email, otp);
  }

  async verifyOtp(email: string, otp: number): Promise<boolean> {
    const otpDoc = await this.otpRepository.getOtpByEmail(email);
    if (!otpDoc)
      throw new AppError(STATUS_CODES.NOT_FOUND, "OTP not found or expired");
    if (Date.now() > otpDoc.expiresAt)
      throw new AppError(STATUS_CODES.BAD_REQUEST, "OTP expired");
    if (otpDoc.otp !== otp)
      throw new AppError(STATUS_CODES.BAD_REQUEST, "Invalid OTP");
    if (otpDoc.purpose !== "verification")
      throw new AppError(STATUS_CODES.BAD_REQUEST, "Invalid OTP purpose");

    // const userData = { ...otpDoc.userData, isEmailVerified: true };
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
    throw new AppError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      "Account setup incomplete. Please try registering again."
    );
  }
    await this.userRepository.updateUser(user._id.toString(), {
    isEmailVerified: true,
  });

  // Clean up OTP after successful verification
  await this.otpRepository.deleteOtp(email);

  return true
  }

  async resendOtp(email: string): Promise<void> {
    const otpDoc = await this.otpRepository.getOtpByEmail(email);
    if (!otpDoc || otpDoc.purpose !== "verification") {
      throw new AppError(STATUS_CODES.NOT_FOUND, "No pending registration");
    }
    await this.sendOtp(email, "verification");
  }

  async forgotPassword(email: string): Promise<void> {
    await this.sendOtp(email, "reset");
  }

  async resetPassword(
    email: string,
    otp: number,
    newPassword: string,
  ): Promise<void> {
    const otpDoc = await this.otpRepository.getOtpByEmail(email);
    if (!otpDoc) throw new AppError(STATUS_CODES.NOT_FOUND, "OTP not found");
    if (Date.now() > otpDoc.expiresAt)
      throw new AppError(STATUS_CODES.BAD_REQUEST, "OTP expired");
    if (otpDoc.otp !== otp)
      throw new AppError(STATUS_CODES.BAD_REQUEST, "Invalid OTP");
    if (otpDoc.purpose !== "reset")
      throw new AppError(STATUS_CODES.BAD_REQUEST, "Invalid OTP purpose");

    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new AppError(STATUS_CODES.NOT_FOUND, "User not found");

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updateUser(user._id.toString(), {
      password: hashed,
    });
    await this.otpRepository.deleteOtp(email);
  }
}
