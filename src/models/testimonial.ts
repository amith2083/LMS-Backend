import mongoose, { Schema, Document, model, Types } from "mongoose";

export interface ITestimonialDocument extends Document {
  _id: Types.ObjectId;
  content: string;
  rating: number;
  courseId: Types.ObjectId;
  user: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const testimonialSchema = new Schema<ITestimonialDocument>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Testimonial =
  mongoose.models.Testimonial ||
  model<ITestimonialDocument>("Testimonial", testimonialSchema);
