
import mongoose, { Schema, Document } from "mongoose";
import { IAssessment } from "../interfaces/assessment/IAssessment";



const assessmentSchema = new Schema<IAssessment>(
  {
    assessments: [
      {
        quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
        attempted: { type: Boolean, required: true },
        options: [
          {
            option: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
            isSelected: { type: Boolean, required: true },
          },
        ],
      },
    ],
    otherMarks: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Assessment =
  mongoose.models.Assessment ?? mongoose.model<IAssessment>("Assessment", assessmentSchema);