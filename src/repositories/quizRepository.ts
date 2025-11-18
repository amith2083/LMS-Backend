// src/repositories/quizRepository.ts
import mongoose from 'mongoose';
import { IQuizsetRepository } from '../interfaces/quiz/IQuizRepository';
import { IQuizset } from '../interfaces/quiz/IQuizset';
import { Quizset } from '../models/quizset';
import { Quiz } from '../models/quizzes';

export class QuizsetRepository implements IQuizsetRepository {
  async getQuizsets(excludeUnpublished: boolean): Promise<IQuizset[]> {
    const query = excludeUnpublished ? { active: true } : {};
    return Quizset.find(query).populate('quizIds').lean().exec();
  }

  async getQuizsetById(id: string): Promise<IQuizset | null> {
    return Quizset.findById(id).populate('quizIds').lean().exec();
  }

  async createQuizset(data: Partial<IQuizset>): Promise<IQuizset> {
    const quizset = await Quizset.create(data);
    return quizset.toObject();
  }

  async updateQuizset(quizsetId: string, data: Partial<IQuizset>): Promise<IQuizset | null> {
    return Quizset.findByIdAndUpdate(quizsetId, data, { new: true }).lean().exec();
  }

  async createQuiz(quizData: any): Promise<string> {
    const quiz = await Quiz.create(quizData);
    return quiz._id.toString();
  }

  async addQuizToQuizset(quizsetId: string, quizId: string): Promise<void> {
    const quizset = await Quizset.findById(quizsetId);
    if (!quizset) throw new Error('Quizset not found');
    if (!quizset.quizIds.includes(quizId as any)) {
      quizset.quizIds.push(quizId as any);
      await quizset.save();
    }
  }

  async deleteQuizFromQuizset(quizsetId: string, quizId: string): Promise<void> {
    await Quizset.findByIdAndUpdate(
      quizsetId,
      { $pull: { quizIds: new mongoose.Types.ObjectId(quizId) } },
      { new: true }
    ).exec();
    await Quiz.findByIdAndDelete(quizId).exec();
  }

  async changeQuizsetPublishState(quizsetId: string): Promise<boolean> {
    const quizset = await Quizset.findById(quizsetId).exec();
    if (!quizset) throw new Error('Quizset not found');
    quizset.active = !quizset.active;
    await quizset.save();
    return quizset.active;
  }

  async deleteQuizset(quizsetId: string): Promise<void> {
    const quizset = await Quizset.findById(quizsetId).exec();
    if (!quizset) throw new Error('Quizset not found');
    await Quiz.deleteMany({ _id: { $in: quizset.quizIds } }).exec();
    await Quizset.findByIdAndDelete(quizsetId).exec();
  }

  async findByTitle(title: string, excludeId?: string): Promise<IQuizset | null> {
    const query: any = { title: { $regex: `^${title}$`, $options: 'i' } };
    if (excludeId) query._id = { $ne: excludeId };
    return Quizset.findOne(query).lean().exec();
  }
}