import { IQuizsetRepository } from "../interfaces/quiz/IQuizRepository";
import { IQuizsetService } from "../interfaces/quiz/IQuizService";
import { IQuizset } from "../interfaces/quiz/IQuizset";
import { Quizset } from "../models/quizset";
import { getSlug } from "../utils/slug";




export class QuizsetService implements IQuizsetService {
  constructor(private quizsetRepository: IQuizsetRepository) {}

  async getQuizsets(excludeUnpublished: boolean): Promise<IQuizset[]> {
    return this.quizsetRepository.getQuizsets(excludeUnpublished);
  }

  async getQuizsetById(id: string): Promise<IQuizset | null> {
    return this.quizsetRepository.getQuizsetById(id);
  }

  async createQuizset(data: Partial<IQuizset>): Promise<IQuizset> {
    
    const existing = await Quizset.findOne({ title: { $regex: `^${data.title}$`, $options: "i" } });
    if (existing) {
      throw new Error("A quizset with this title already exists");
    }
    const quizsetData = {
      ...data,
      slug: getSlug(data.title || ""),
      active: data.active ?? false,
    };
    console.log('quizsetdata',quizsetData)
    return this.quizsetRepository.createQuizset(quizsetData);
  }

  async updateQuizset(quizsetId: string, data: Partial<IQuizset>): Promise<IQuizset | null> {
    
    if (data.title) {
      const existing = await Quizset.findOne({
        title: { $regex: `^${data.title}$`, $options: "i" },
        _id: { $ne: quizsetId },
      });
      if (existing) {
        throw new Error("A quizset with this title already exists");
      }
    }
    return this.quizsetRepository.updateQuizset(quizsetId, data);
  }

  async addQuizToQuizset(quizsetId: string, quizData: any): Promise<void> {
   
    const transformedQuizData = {
  title: quizData.title,
  description: quizData.description,
  slug: getSlug(quizData.title || ""),
  options: (quizData.options || []).map((opt: { text: string; is_correct: boolean }) => ({
    text: opt.label,
    is_correct: opt.isTrue,
  })).filter(opt => opt.text), // Ensure no empty text
  mark: quizData.mark || 5,
  explanations: quizData.explanations,
};
    if (!transformedQuizData.options.some(opt => opt.is_correct)) {
      throw new Error("At least one option must be correct");
    }
    const quizId = await this.quizsetRepository.createQuiz(transformedQuizData);
    await this.quizsetRepository.addQuizToQuizset(quizsetId, quizId);
  }

  async deleteQuizFromQuizset(quizsetId: string, quizId: string): Promise<void> {
   
    return this.quizsetRepository.deleteQuizFromQuizset(quizsetId, quizId);
  }

  async changeQuizsetPublishState(quizsetId: string): Promise<boolean> {
   
    return this.quizsetRepository.changeQuizsetPublishState(quizsetId);
  }

  async deleteQuizset(quizsetId: string): Promise<void> {
  
    return this.quizsetRepository.deleteQuizset(quizsetId);
  }
}