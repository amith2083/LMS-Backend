import { Document, Types } from "mongoose";


export interface IModule extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: boolean;
  slug: string;
  courseId: Types.ObjectId;
  lessonIds: Types.ObjectId[];
  order: number;
}