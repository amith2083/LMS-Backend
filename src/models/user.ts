import mongoose, { Document, Schema, model, models } from "mongoose";
import { Types } from "mongoose";
export interface IUserDocument extends Document {
  _id: Types.ObjectId;
name: string;
  email: string;
  password: string;
  role: "admin" | "instructor" | "student";
  doc?: string;
  bio?: string;
  phone?: number;
  website?: string;
  profilePicture?: string;
  designation?: string;
  isGoogleUser?: boolean;
  isBlocked: boolean;
  isVerified: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const userSchema: Schema<IUserDocument> = new Schema(
  {
    name: { required: true, type: String },
    password: { type: String },
    email: { required: true, unique: true, type: String },
    role: { type: String, enum: ["admin", "instructor", "student"] },
    doc: { type: String },
    bio: { type: String },
    phone: { type: Number },
    website: { type: String },
    profilePicture: {
      type: String,
      default: () =>
        "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-Transparent-Free-PNG-Clip-Art.png",
    },
    designation: { type: String },
    isGoogleUser: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || model<IUserDocument>("User", userSchema);
