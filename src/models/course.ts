import mongoose, { Schema } from "mongoose";
import { ICourse } from "../interfaces/course/ICourse";



const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String, required: true },
  thumbnail: { type: String },
  modules: [{ type: Schema.Types.ObjectId, ref: "Module" }],
  price: { type: Number },
  status: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  testimonials: [{ type: Schema.Types.ObjectId, ref: "Testimonial" }],
  quizSet: { type: Schema.Types.ObjectId, ref: "Quizset" },
  learning: [{ type: String }],
 
},
 {
    timestamps: true,
  });

export const Course = mongoose.model<ICourse>("Course", courseSchema);
