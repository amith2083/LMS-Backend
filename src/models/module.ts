import mongoose, { Schema, Model } from "mongoose";
import { IModule } from "../interfaces/module/IModule";

const moduleSchema = new Schema<IModule>(
  {
    title: {
      type: String,
      required: true,
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


export const Module: Model<IModule> =
  mongoose.models.Module || mongoose.model<IModule>("Module", moduleSchema);
