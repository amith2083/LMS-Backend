
import { IAssessmentRepository } from "../interfaces/assessment/IAssessmentRepository";
import { IAssessment } from "../interfaces/assessment/IAssessment";
import { Assessment } from "../models/assessment";

export class AssessmentRepository implements IAssessmentRepository {
  async createAssessment(data: Partial<IAssessment>): Promise<IAssessment> {
    const assessment = await Assessment.create(data);
    return assessment.toObject();
  }
}