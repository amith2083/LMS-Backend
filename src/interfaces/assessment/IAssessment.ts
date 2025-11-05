import { Types } from "mongoose";

export interface IAssessment {
  assessments: string[]; // or object[] if you want to store details of each assessment
  otherMarks: number;
  createdOn?: Date;
  modifiedOn?: Date;
}
