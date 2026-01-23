import { IAssessmentDocument } from "../../models/assessment";
import { IAssessment } from "../../types/assessment";

export interface IAssessmentRepository {
  createAssessment(data: Partial<IAssessment>): Promise<IAssessmentDocument>;
}
