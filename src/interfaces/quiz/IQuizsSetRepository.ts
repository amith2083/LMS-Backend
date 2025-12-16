import { IQuizset } from "./IQuizset";


export interface IQuizSetRepository {
  getQuizsets(instructorId:string): Promise<IQuizset[]>;
  getQuizsetById(id: string): Promise<IQuizset | null>;
  createQuizset(data: Partial<IQuizset>): Promise<IQuizset>;
  updateQuizset(quizsetId: string, data: Partial<IQuizset>): Promise<IQuizset | null>;
  changeQuizsetPublishState(quizsetId: string): Promise<boolean>;
   deleteQuizset(quizsetId: string): Promise<void>;
   
  addQuizToQuizset(quizsetId: string, quizId: string): Promise<void>;
  removeQuizFromQuizset(quizsetId: string, quizId: string): Promise<void>;
 findByTitle(title: string, excludeId?: string): Promise<IQuizset | null> 
}