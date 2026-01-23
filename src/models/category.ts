import mongoose, { model, Schema, Document, Types } from "mongoose";

export interface ICategoryDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  thumbnail?: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Category =
  mongoose.models.Category ||
  model<ICategoryDocument>("Category", categorySchema);
