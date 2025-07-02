import mongoose, { Document, Schema } from "mongoose";
import { ICategory } from "../interfaces/category/ICategory";

const categorySchema = new Schema<ICategory>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    required: false,
    default: true,
  },
});

export const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", categorySchema);
