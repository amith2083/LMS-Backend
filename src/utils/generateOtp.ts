import { Otp } from "../models/otp";

export const generateOtpForEmail = async (email: string): Promise<number> => {
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  console.log("otpis ", otp);
  const expiresAt = Date.now() + 1 * 60 * 1000; // 1 min for verification, 2 min for reset
  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );
  return otp;
};
