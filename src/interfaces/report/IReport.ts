import { Types } from "mongoose";

export interface IReport {
  totalCompletedLessons: Types.ObjectId[]; 
  totalCompletedModules: Types.ObjectId[];  
  course: Types.ObjectId;
  student: Types.ObjectId;
  quizAssessment?: Types.ObjectId;
      completion_date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
