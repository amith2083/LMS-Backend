import { Otp } from '../models/otp';
import { IOtpRepository, IOtp } from '../interfaces/otp/IOtpRepository';
import { AppError } from '../utils/asyncHandler';

export class OtpRepository implements IOtpRepository {
  async saveOtp(email: string, otp: number, expiresAt: number): Promise<void> {
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );
  }

  async getOtpByEmail(email: string): Promise<IOtp | null> {
    const otpDoc = await Otp.findOne({ email }).lean();
    return otpDoc;
  }

  async deleteOtp(email: string): Promise<void> {
    await Otp.deleteOne({ email });
  }
}