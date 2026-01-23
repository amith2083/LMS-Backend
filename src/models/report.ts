import mongoose, { Schema, Types, model } from "mongoose";
export interface IReportDocument extends Document {
  _id: Types.ObjectId;
  course: Types.ObjectId;
  student: Types.ObjectId;
  totalCompletedLessons: Types.ObjectId[];
  totalCompletedModules: Types.ObjectId[];
  quizAssessment?: Types.ObjectId;
  completionDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const reportSchema = new Schema<IReportDocument>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalCompletedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],

    totalCompletedModules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Module",
      },
    ],

    quizAssessment: {
      type: Schema.Types.ObjectId,
      ref: "Assessment",
    },

    completionDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Report =
  mongoose.models.Report ||
  model<IReportDocument>("Report", reportSchema);
