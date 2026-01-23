import mongoose, { model, Schema, Types } from "mongoose";
import { Document } from "mongoose";

export interface IEnrollmentDocument extends Document {
  _id: Types.ObjectId;
  enrollment_date: Date;
  status: "not-started" | "in-progress" | "completed";
  completion_date?: Date;
  method: "stripe";
  course: Types.ObjectId;
  student: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const enrollmentSchema = new Schema<IEnrollmentDocument>(
  {
    enrollment_date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
      required: true,
    },
    completion_date: {
      type: Date,
    },
    method: {
      type: String,
      enum: [ "stripe"],
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Enrollment =
  mongoose.models.Enrollment ||
  model<IEnrollmentDocument>("Enrollment", enrollmentSchema);
