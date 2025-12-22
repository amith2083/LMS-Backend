
import mongoose, { Schema, model, models } from "mongoose";

export interface IPayout {
  instructor: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrollment: mongoose.Types.ObjectId;
  amount: number; // Amount credited to instructor
  platformFee: number; // Amount kept by platform
  totalAmount: number; // Full course price
  status: "pending" | "paid";
  paidAt?: Date;
}

const payoutSchema = new Schema<IPayout>(
  {
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    enrollment: { type: Schema.Types.ObjectId, ref: "Enrollment", required: true },
    amount: { type: Number, required: true }, // instructor's share
    platformFee: { type: Number, required: true },
    totalAmount: { type: Number, required: true }, // full price paid
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export const Payout = models.Payout || model<IPayout>("Payout", payoutSchema);