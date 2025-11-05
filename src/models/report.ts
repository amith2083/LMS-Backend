import mongoose, { Schema } from "mongoose";
import { IReport } from "../interfaces/report/IReport";

const reportSchema = new Schema<IReport>(
  {
    totalCompletedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson", required: true }],
    totalCompletedModules: [{ type: Schema.Types.ObjectId, ref: "Module", required: true }],
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizAssessment: { type: Schema.Types.ObjectId, ref: "Assessment" },
        completion_date: {
        required: false,
        type: Date
    

  },
},
  { timestamps: true }
);

export const Report = mongoose.models.Report ?? mongoose.model<IReport>("Report", reportSchema);
