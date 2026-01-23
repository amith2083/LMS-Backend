import  { Types } from "mongoose";

export interface IEnrollment {
  enrollment_date: Date;
  status: string;
  completion_date?: Date;
  method: string;
  course: Types.ObjectId;
  student: Types.ObjectId;
  
}