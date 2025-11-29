import mongoose from "mongoose";

export interface IAssessmentOption {
  option: string;
  isCorrect: boolean;
  isSelected: boolean;
}

export interface IAssessmentItem {
  quizId: mongoose.Types.ObjectId;
  attempted: boolean;
  options: IAssessmentOption[];
}

export interface IAssessment extends Document {
  assessments: IAssessmentItem[];
  otherMarks: number;
  createdAt?: Date;
  updatedAt?: Date;
}