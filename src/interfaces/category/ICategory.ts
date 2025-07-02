import { Document, Types } from "mongoose";

export interface ICategory extends Document {
  title: string;
  description: string;
  thumbnail?: string;
  status: boolean;
}
