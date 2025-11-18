import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { ILesson } from "../interfaces/lesson/ILesson";

const lessonSchema: Schema<ILesson> = new Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    required: false,
    type: String,
  },
  duration: {
    required: true,
    default: 0,
    type: Number,
  },
  videoKey: {
    required: false,
    type: String,
  },
  active: {
    required: true,
    default: false,
    type: Boolean,
  },
  slug: {
    required: true,
    type: String,
  },
  access: {
    required: true,
    default: "private",
    type: String,
    enum: ["private", "public"], // optional: enforce allowed values
  },
  order: {
    required: true,
    type: Number,
  },
}, {
    timestamps: true,
  });

export const Lesson: Model<ILesson> =
  mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", lessonSchema);
