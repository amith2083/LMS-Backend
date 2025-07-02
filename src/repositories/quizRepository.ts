import mongoose from "mongoose";
import { IQuizsetRepository } from "../interfaces/quiz/IQuizRepository";
import { IQuizset } from "../interfaces/quiz/IQuizset";
import { Quizset } from "../models/quizset";
import { Quiz } from "../models/quizzes";
import { Course } from "../models/course";




export class QuizsetRepository implements IQuizsetRepository {
  async getQuizsets(excludeUnpublished: boolean): Promise<IQuizset[]> {
    const query = excludeUnpublished ? { active: true } : {};
    const quizsets = await Quizset.find(query).populate("quizIds").lean();
    return quizsets;
  }

  async getQuizsetById(id: string): Promise<IQuizset| null> {
    const quizset = await Quizset.findById(id).populate("quizIds").lean();
    return quizset ;
  }

  async createQuizset(data: Partial<IQuizset>): Promise<IQuizset> {
    const quizset = await Quizset.create(data);
    console.log('quizset',quizset)
    return JSON.parse(JSON.stringify(quizset));
  }

  async updateQuizset(
    quizsetId: string,
    data: Partial<IQuizset>
  ): Promise<IQuizset| null> {
    const updatedQuizset = await Quizset.findByIdAndUpdate(quizsetId, data, {
      new: true,
    }).lean();
    return updatedQuizset;
  }

  async createQuiz(quizData: any): Promise<string> {
    const quiz = await Quiz.create(quizData);
    return quiz._id.toString();
  }

  async addQuizToQuizset(quizsetId: string, quizId: string): Promise<void> {
    const quizset = await Quizset.findById(quizsetId);
    if (!quizset) throw new Error("Quizset not found");
    if (!quizset.quizIds.includes(quizId as any)) {
      quizset.quizIds.push(quizId as any);
      await quizset.save();
    }
  }

  async deleteQuizFromQuizset(
    quizsetId: string,
    quizId: string
  ): Promise<void> {
    console.log('quizsetids',quizsetId,quizId)
    
 await Quizset.findByIdAndUpdate(quizsetId, { $pull: { quizIds: new mongoose.Types.ObjectId(quizId) } });
    await Quiz.findByIdAndDelete(quizId);
    
   
  }

  async changeQuizsetPublishState(quizsetId: string): Promise<boolean> {
    const quizset = await Quizset.findById(quizsetId);
    if (!quizset) throw new Error("Quizset not found");
   
    quizset.active = !quizset.active;
    await quizset.save();
    return quizset.active;
  }

  async deleteQuizset(quizsetId: string): Promise<void> {
    const quizset = await Quizset.findById(quizsetId);
    if (!quizset) throw new Error("Quizset not found");
    const courses = await Course.find({ quizSet: quizsetId }).lean();
    if (courses.length > 0) {
      throw new Error("Cannot delete quizset used by courses");
    }
    await Quiz.deleteMany({ _id: { $in: quizset.quizIds } });
    await Quizset.findByIdAndDelete(quizsetId);
  }
}
