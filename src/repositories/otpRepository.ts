import { Otp } from '../models/otp';
import { IOtpRepository, } from '../interfaces/otp/IOtpRepository';
import { AppError } from '../utils/asyncHandler';
import { IUser } from '../interfaces/user/IUser';
import { IOtp } from '../interfaces/otp/IOtp';

export class OtpRepository implements IOtpRepository {
  async saveOtp(
    email: string,
    otp: number,
    expiresAt: number,
    purpose: "verification" | "reset",
    userData?: Partial<IUser>
  ): Promise<void> {
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt, purpose, userData },
      { upsert: true, new: true }
    );
  }

  async getOtpByEmail(email: string): Promise<IOtp | null> {
    const otpDoc = await Otp.findOne({ email });
    return otpDoc;
  }

  async deleteOtp(email: string): Promise<void> {
    await Otp.deleteOne({ email });
  }
}