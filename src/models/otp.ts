
import mongoose, { Schema, Document } from "mongoose";

interface IOtp extends Document {
  email: string;
  otp: number;
  expiresAt: number;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true,},
  otp: { type: Number, required: true },
  expiresAt: { type: Number, required: true },
});

export const Otp = mongoose.models.Otp || mongoose.model<IOtp>("Otp", otpSchema);

