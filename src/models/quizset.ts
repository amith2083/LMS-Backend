import mongoose, { Schema, Document, model, Types } from "mongoose";
import { IQuizDocument } from "../models/quizzes";




export interface IQuizsetDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  slug?: string;
  instructor: Types.ObjectId;
  quizIds: Types.ObjectId[];
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}



export interface IQuizsetPopulatedDocument
  extends Omit<IQuizsetDocument, "quizIds"> {
  quizIds: IQuizDocument[];
}


const quizsetSchema = new Schema<IQuizsetDocument>(
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
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Quizset =
  mongoose.models.Quizset ||
  model<IQuizsetDocument>("Quizset", quizsetSchema);
