import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IWatchDocument extends Document {
  _id: Types.ObjectId;
  state: "started" | "completed";
  lesson: Types.ObjectId;
  module: Types.ObjectId;
  user: Types.ObjectId;
  lastTime: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const watchSchema = new Schema<IWatchDocument>(
  {
    state: {
      type: String,
      required: true,
      default: "started",
      enum: ["started", "completed"],
    },
    lesson: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    module: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastTime: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Watch =
  mongoose.models.Watch ||
  model<IWatchDocument>("Watch", watchSchema);
