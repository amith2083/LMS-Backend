import mongoose, { Schema, model, Types } from "mongoose";

export interface IAssessmentDocument extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  course: Types.ObjectId;
  quizSet: Types.ObjectId;
  assessments: {
    quizId: Types.ObjectId;
    attempted: boolean;
    options: {
      option: string;
      isCorrect: boolean;
      isSelected: boolean;
    }[];
  }[];
  otherMarks: number;
  totalScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
const assessmentSchema = new Schema<IAssessmentDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    quizSet: {
      type: Schema.Types.ObjectId,
      ref: "Quizset",
      required: true,
    },

    assessments: [
      {
        quizId: {
          type: Schema.Types.ObjectId,
          ref: "Quiz",
          required: true,
        },
        attempted: {
          type: Boolean,
          required: true,
        },
        options: [
          {
            option: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
            isSelected: { type: Boolean, required: true },
          },
        ],
      },
    ],

    otherMarks: {
      type: Number,
      default: 0,
    },

    totalScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Assessment =
  mongoose.models.Assessment ||
  model<IAssessmentDocument>("Assessment", assessmentSchema);
