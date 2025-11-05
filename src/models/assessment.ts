import mongoose, { Schema } from "mongoose";
import { IAssessment } from "../interfaces/assessment/IAssessment";

const assessmentSchema = new Schema<IAssessment>(
  {
    assessments: { type: [String], required: true },
    otherMarks: { type: Number, required: true },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Assessment = mongoose.models.Assessment ?? mongoose.model<IAssessment>("Assessment", assessmentSchema);
