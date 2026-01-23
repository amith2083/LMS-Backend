import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IOtpDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  otp: number;
  expiresAt: number;
  purpose: "verification" | "reset";
  userData?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const otpSchema = new Schema<IOtpDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["verification", "reset"],
      required: true,
    },
    userData: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index (auto delete when expiresAt < now)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });



export const Otp =
  mongoose.models.Payout ||
  model<IOtpDocument>("Otp", otpSchema);