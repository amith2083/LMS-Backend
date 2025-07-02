
import mongoose, { Schema, Model } from "mongoose";
import { IQuiz } from "../interfaces/quiz/IQuiz";

const quizzesSchema: Schema<IQuiz> = new Schema({
  title: {
    required: true,
    type: String,
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
  options: {
    type: Array, 
  },
  mark: {
    required: true,
    default: 5,
    type: Number,
  },
});


export const Quiz: Model<IQuiz> = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", quizzesSchema);