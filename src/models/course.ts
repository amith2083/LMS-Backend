import mongoose, { model, Schema, Types } from "mongoose";


export interface IPopulatedInstructor {
  _id: Types.ObjectId;
  name: string;
  email: string;
  profilePicture?: string;
  designation?:string;
  
}

export interface ICourseDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail?: string;
  modules?: Types.ObjectId[];
  price?: number;
  status?: boolean;
  isApproved?: boolean;
  category?: Types.ObjectId | null;
  instructor?: IPopulatedInstructor;
  testimonials?: Types.ObjectId[];
  quizSet?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const courseSchema = new Schema<ICourseDocument>(
  {
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
    
  },
  {
    timestamps: true,
  }
);

export const Course =
  mongoose.models.Course || model<ICourseDocument>("Course", courseSchema);
