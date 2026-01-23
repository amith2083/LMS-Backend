import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IModuleDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: boolean;
  slug: string;
  courseId: Types.ObjectId;
  lessonIds: Types.ObjectId[];
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const moduleSchema = new Schema<IModuleDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessonIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Module =
  mongoose.models.Module ||
  model<IModuleDocument>("Module", moduleSchema);
