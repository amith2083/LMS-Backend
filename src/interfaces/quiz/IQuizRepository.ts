import { IQuizset } from "./IQuizset";


export interface IQuizsetRepository {
  getQuizsets(excludeUnpublished: boolean): Promise<IQuizset[]>;
  getQuizsetById(id: string): Promise<IQuizset | null>;
  createQuizset(data: Partial<IQuizset>): Promise<IQuizset>;
  updateQuizset(quizsetId: string, data: Partial<IQuizset>): Promise<IQuizset | null>;
  createQuiz(quizData: any): Promise<string>;
  addQuizToQuizset(quizsetId: string, quizId: string): Promise<void>;
  deleteQuizFromQuizset(quizsetId: string, quizId: string): Promise<void>;
  changeQuizsetPublishState(quizsetId: string): Promise<boolean>;
  deleteQuizset(quizsetId: string): Promise<void>;
}
