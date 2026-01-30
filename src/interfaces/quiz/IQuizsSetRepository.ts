import { IQuizsetDocument, IQuizsetPopulatedDocument } from "../../models/quizset";
import { IQuizset } from "../../types/quizset";

export interface IQuizSetRepository {
  getQuizsets(instructorId: string): Promise<IQuizsetDocument[]>;
  getQuizsetById(id: string): Promise<IQuizsetPopulatedDocument | null>;
  createQuizset(data: Partial<IQuizset>): Promise<IQuizsetDocument>;
  updateQuizset(
    quizsetId: string,
    data: Partial<IQuizset>,
  ): Promise<IQuizsetDocument | null>;
  changeQuizsetPublishState(quizsetId: string): Promise<boolean>;
  deleteQuizset(quizsetId: string): Promise<void>;
  addQuizToQuizset(quizsetId: string, quizId: string): Promise<void>;
  removeQuizFromQuizset(quizsetId: string, quizId: string): Promise<void>;
  findByTitle(
    title: string,
    excludeId?: string,
  ): Promise<IQuizsetDocument | null>;
}
