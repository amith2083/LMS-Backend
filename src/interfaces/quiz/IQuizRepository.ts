import { IQuiz } from "./IQuiz";

export interface IQuizRepository {
  createQuiz(data: Partial<IQuiz>): Promise<string>;
  deleteQuiz(id: string): Promise<void>;
}
