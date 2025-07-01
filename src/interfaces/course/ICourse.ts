import { Types } from "mongoose";

export interface ICourse {
  title: string;
  subtitle?: string;
  description: string;
  thumbnail?: string;
  modules?: Types.ObjectId[];
  price?: number;
  status?: boolean;
  isApproved?: boolean;
  category?: Types.ObjectId | null;
  instructor: Types.ObjectId;
  testimonials?: Types.ObjectId[];
  quizSet?: Types.ObjectId;
  learning?: string[];
  createdOn?: Date;
  modifiedOn?: Date;
}
