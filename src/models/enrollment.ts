import mongoose, { Schema, Model } from "mongoose";
import { IEnrollment } from "../interfaces/enrollment/IEnrollment";



const enrollmentSchema: Schema<IEnrollment> = new Schema(
  {
    enrollment_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      required: true,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
    },
    completion_date: {
      type: Date,
      required: false,
    },
    method: {
      type: String,
      required: true,
      enum: ["credit-card", "paypal", "stripe"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment || mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);