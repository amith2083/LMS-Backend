import mongoose from "mongoose";

export interface IEnrollment {
  _id: mongoose.Types.ObjectId;
  enrollment_date: Date;
  status: string;
  completion_date?: Date;
  method: string;
  course: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}