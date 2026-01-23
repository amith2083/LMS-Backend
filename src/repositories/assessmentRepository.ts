
import { IAssessmentRepository } from "../interfaces/assessment/IAssessmentRepository";
import { Assessment, IAssessmentDocument } from "../models/assessment";
import { IAssessment } from "../types/assessment";


export class AssessmentRepository implements IAssessmentRepository {
  async createAssessment(data: Partial<IAssessment>): Promise<IAssessmentDocument> {
    const assessment = await Assessment.create(data);
    return assessment;
  }
}