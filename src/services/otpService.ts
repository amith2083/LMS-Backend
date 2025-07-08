import { IOtpService } from "../interfaces/otp/IOtpService";
import { IOtpRepository } from "../interfaces/otp/IOtpRepository";
import { AppError } from "../utils/asyncHandler";
import { sendOtpEmail } from "../utils/sendOtpEmail";
import { UserRepository } from "../repositories/userRepository";
import bcrypt from "bcrypt";

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
    purpose: "verification" | "reset"
  ): Promise<void> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new AppError(404, "User not found");

    const otp = this.generateOtp();
    const expiresAt =
      Date.now() + (purpose === "verification" ? 1 : 2) * 60 * 1000;
    await this.otpRepository.saveOtp(email, otp, expiresAt);
    await sendOtpEmail(email, otp);
  }

  async verifyOtp(email: string, otp: number): Promise<boolean> {
    const otpDoc = await this.otpRepository.getOtpByEmail(email);
    if (!otpDoc) throw new AppError(404, "OTP not found");
    if (Date.now() > otpDoc.expiresAt)
      throw new AppError(400, "OTP has expired");
    if (otpDoc.otp !== otp) throw new AppError(400, "Invalid OTP");

    await this.otpRepository.deleteOtp(email);
    // const user = await this.userRepository.getUserByEmail(email);
    // if (user && !user.isVerified) {
    //   await this.userRepository.updateUser(user._id);
    // }
    return true;
  }

  async resendOtp(email: string): Promise<void> {
    await this.sendOtp(email, "verification");
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

    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new AppError(404, "User not found");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updateUser(user._id, {
      password: hashedPassword,
    });
    await this.otpRepository.deleteOtp(email);
  }
}
