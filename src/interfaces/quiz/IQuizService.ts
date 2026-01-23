import { IQuizsetDocument } from "../../models/quizset";
import { IQuizset } from "../../types/quizset";


export interface IQuizService {
  getQuizsets(instructorId:string): Promise<IQuizsetDocument[]>;
  getQuizsetById(id: string): Promise<IQuizsetDocument | null>;
  createQuizset(data: {title:string},instructorId:string): Promise<IQuizsetDocument>;
  updateQuizset(quizsetId: string, data: Partial<IQuizset>): Promise<IQuizsetDocument | null>;
    changeQuizsetPublishState(quizsetId: string): Promise<boolean>;
    deleteQuizset(quizsetId: string): Promise<void>;
    //upto quizset methods---------------------------------------------------------------------------------------------------------
  createQuiz(quizsetId: string, quizData: any): Promise<void>;
  removeQuizFromQuizset(quizsetId: string, quizId: string): Promise<void>;


}