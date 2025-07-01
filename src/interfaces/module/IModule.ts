import {  Types } from "mongoose";

export interface IModule {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  status: boolean;
  slug: string;
  courseId: Types.ObjectId;
  lessonIds: Types.ObjectId[];
  order: number;
}