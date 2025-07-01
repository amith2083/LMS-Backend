import { Types } from "mongoose";

export interface ILesson {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  duration: number;
  video_url?: string;
  active: boolean;
  slug: string;
  access: "private" | "public";
  order: number;
}
