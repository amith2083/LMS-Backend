import { IUser } from "../user/IUser";

export interface IOtpService {
  sendOtp(email: string, purpose: 'verification' | 'reset',userData?: Partial<IUser>): Promise<void>;
  verifyOtp(email: string, otp: number): Promise<boolean>;
  resendOtp(email: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(email: string, otp: number, newPassword: string): Promise<void>;
}