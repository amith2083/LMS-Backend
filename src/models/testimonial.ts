import mongoose, { Schema, Types } from "mongoose";
import { ITestimonial } from "../interfaces/Testimonial/ITestimonial";

const testimonialSchema = new Schema<ITestimonial>(
  {
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, max: 5
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
  { timestamps: true }
);

export const Testimonial =
  mongoose.models.Testimonial ??
  mongoose.model<ITestimonial>("Testimonial", testimonialSchema);
