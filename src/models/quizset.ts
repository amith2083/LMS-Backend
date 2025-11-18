
import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IQuizset } from '../interfaces/quiz/IQuizset';


const quizsetSchema = new Schema<IQuizset>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
  },
  quizIds: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
    timestamps: true,
  });
export const Quizset: Model<IQuizset> =
  mongoose.models.Quizset || mongoose.model<IQuizset>("Quizset", quizsetSchema);
