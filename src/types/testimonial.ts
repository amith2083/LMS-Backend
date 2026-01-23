import { Types } from "mongoose";

export interface ITestimonial {
  content: string;
  rating: number;
  courseId: string;
  user: string;
  createdAt?: Date;
  updatedAt?: Date;
}
