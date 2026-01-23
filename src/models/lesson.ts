import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface ILessonDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  duration: number;
  videoKey?: string;
  active: boolean;
  slug: string;
  access: "private" | "public";
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const lessonSchema = new Schema<ILessonDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
      required: true,
      default: 0,
    },
    videoKey: {
      type: String,
    },
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    slug: {
      type: String,
      required: true,
    },
    access: {
      type: String,
      required: true,
      enum: ["private", "public"],
      default: "private",
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Lesson =
  mongoose.models.Lesson ||
  model<ILessonDocument>("Lesson", lessonSchema);
