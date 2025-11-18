import { Types } from "mongoose";

export interface ITestimonial {
  content: string;
  rating: number;
  courseId: Types.ObjectId;
  user: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
