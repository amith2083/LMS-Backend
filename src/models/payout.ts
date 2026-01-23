import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IPayoutDocument extends Document {
  _id: Types.ObjectId;
  instructor: Types.ObjectId;
  course: Types.ObjectId;
  enrollment: Types.ObjectId;
  amount: number;//instructor fee
  platformFee: number;
  totalAmount: number;//course price
  status: "pending" | "paid";
  paidAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const payoutSchema = new Schema<IPayoutDocument>(
  {
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Payout =
  mongoose.models.Payout ||
  model<IPayoutDocument>("Payout", payoutSchema);
