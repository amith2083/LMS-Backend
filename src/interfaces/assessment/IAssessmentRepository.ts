import { IAssessment } from "./IAssessment";



export interface IAssessmentRepository {

 createAssessment(data: Partial<IAssessment>): Promise<IAssessment> 
}