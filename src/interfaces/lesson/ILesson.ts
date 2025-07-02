import { Types,Document } from "mongoose";

export interface ILesson extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  duration: number;
  videoKey?: string;
  active: boolean;
  slug: string;
  access: "private" | "public";
  order: number;
}
