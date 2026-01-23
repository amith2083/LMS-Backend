import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface IQuizOption {
  text: string;
  is_correct: boolean;
}

export interface IQuizDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  slug?: string;
  explanations?: string;
  options?: IQuizOption[];
  mark: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const quizSchema = new Schema<IQuizDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
    },
    explanations: {
      type: String,
    },
    options: [
  {
    text: { type: String, required: true },
    is_correct: { type: Boolean, required: true },
  },
],
      
    mark: {
      type: Number,
      required: true,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

export const Quiz =
  mongoose.models.Quiz ||
  model<IQuizDocument>("Quiz", quizSchema);
