import { IQuizset } from "./IQuizset";


export interface IQuizService {
  getQuizsets(instructorId:string): Promise<IQuizset[]>;
  getQuizsetById(id: string): Promise<IQuizset | null>;
  createQuizset(data: Partial<IQuizset>,instructorId:string): Promise<IQuizset>;
  updateQuizset(quizsetId: string, data: Partial<IQuizset>): Promise<IQuizset | null>;
    changeQuizsetPublishState(quizsetId: string): Promise<boolean>;
    deleteQuizset(quizsetId: string): Promise<void>;
    //upto quizset methods------------------------------------------------------------------------------------------
  createQuiz(quizsetId: string, quizData: any): Promise<void>;
  removeQuizFromQuizset(quizsetId: string, quizId: string): Promise<void>;


}