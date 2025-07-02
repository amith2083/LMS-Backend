import { Types } from "mongoose";

export interface IQuizset {
  title: string;
  description?: string;
  slug?: string;
  quizIds: Types.ObjectId[];
  active: boolean;
}
