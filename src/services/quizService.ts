import { AppError } from '../utils/asyncHandler';
import { ICourseRepository } from '../interfaces/course/ICourseRepository';
import { getSlug } from '../utils/slug';
import { STATUS_CODES } from '../constants/http';
import { IQuizService } from '../interfaces/quiz/IQuizService';
import { IQuizSetRepository } from '../interfaces/quiz/IQuizsSetRepository';
import { IQuizRepository } from '../interfaces/quiz/IQuizRepository';
import { IQuizset } from '../types/quizset';
import { IQuizsetDocument, IQuizsetPopulatedDocument } from '../models/quizset';


export class QuizService implements IQuizService {
  constructor(
    private quizsetRepository: IQuizSetRepository,
    private courseRepository: ICourseRepository,
    private quizRepository: IQuizRepository
  ) {}

  async getQuizsets(instructorId:string): Promise<IQuizsetDocument[]> {
    return await this.quizsetRepository.getQuizsets(instructorId);
  }

  async getQuizsetById(id: string): Promise<IQuizsetPopulatedDocument> {
    const quizset = await this.quizsetRepository.getQuizsetById(id);
    if (!quizset) throw new AppError(STATUS_CODES.NOT_FOUND, 'Quizset not found');
    return quizset;
  }

  async createQuizset(data: {title:string},instructorId:string): Promise<IQuizsetDocument> {
    if (!data.title) throw new AppError(STATUS_CODES.BAD_REQUEST, 'Title is required');

    const existing = await this.quizsetRepository.findByTitle(data.title);
    if (existing) throw new AppError(STATUS_CODES.CONFLICT, 'A quizset with this title already exists');

    const quizsetData = {
      ...data,
      slug: getSlug(data.title),
      instructor:instructorId
      
    };

    return this.quizsetRepository.createQuizset(quizsetData);
  }

  async updateQuizset(quizsetId: string, data: Partial<IQuizset>): Promise<IQuizsetDocument> {
    if (data.title) {
      const existing = await this.quizsetRepository.findByTitle(data.title, quizsetId);
      if (existing) throw new AppError(STATUS_CODES.CONFLICT, 'A quizset with this title already exists');
    }

    const updated = await this.quizsetRepository.updateQuizset(quizsetId, data);
    if (!updated) throw new AppError(STATUS_CODES.NOT_FOUND, 'Quizset not found');
    return updated;
  }
    async changeQuizsetPublishState(quizsetId: string): Promise<boolean> {
    return this.quizsetRepository.changeQuizsetPublishState(quizsetId);
  }
   async deleteQuizset(quizsetId: string): Promise<void> {
    const quizset = await this.quizsetRepository.getQuizsetById(quizsetId);
    if (!quizset) throw new AppError(STATUS_CODES.NOT_FOUND, 'Quizset not found');

    const courses = await this.courseRepository.getCoursesByQuizsetId(quizsetId);
    if (courses.length > 0) {
      throw new AppError(STATUS_CODES.CONFLICT, 'Cannot delete quizset used by courses');
    }

    await this.quizsetRepository.deleteQuizset(quizsetId);
  }

  async createQuiz(quizsetId: string, quizData: any): Promise<void> {
    if (!quizData.title) throw new AppError(STATUS_CODES.BAD_REQUEST, 'Quiz title is required');

    const transformedQuizData = {
      title: quizData.title,
      description: quizData.description,
      slug: getSlug(quizData.title),
      options: (quizData.options || [])
        .map((opt: any) => ({
          text: opt.label,
          is_correct: opt.isTrue,
        }))
        .filter((opt: any) => opt.text),
      mark: quizData.mark || 5,
      explanations: quizData.explanations,
    };

    if (!transformedQuizData.options.some((opt: any) => opt.is_correct)) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'At least one option must be correct');
    }

    const quizId = await this.quizRepository.createQuiz(transformedQuizData);
    await this.quizsetRepository.addQuizToQuizset(quizsetId, quizId);
  }

  async removeQuizFromQuizset(quizsetId: string, quizId: string): Promise<void> {
      // Remove quizId reference from quizset
    await this.quizsetRepository.removeQuizFromQuizset(quizsetId, quizId);


      // Delete the quiz itself
    await this.quizRepository.deleteQuiz(quizId);
  }



 
}