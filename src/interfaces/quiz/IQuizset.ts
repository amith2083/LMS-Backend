import { Types } from "mongoose";

export interface IQuizset {
  title: string;
  description?: string;
  slug?: string;
   instructor:Types.ObjectId,
  quizIds: Types.ObjectId[];
  active: boolean;
}
