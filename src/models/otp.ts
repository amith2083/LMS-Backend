import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/user/IUser";
import { IOtp } from "../interfaces/otp/IOtp";

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true, unique: true },
  otp: { type: Number, required: true },
  expiresAt: { type: Number, required: true },
  purpose: { type: String, enum: ["verification", "reset"], required: true },
  userData: { type: Schema.Types.Mixed, required: false },
}, {
    timestamps: true,
  });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp =
  mongoose.models.Otp || mongoose.model<IOtp>("Otp", otpSchema);
