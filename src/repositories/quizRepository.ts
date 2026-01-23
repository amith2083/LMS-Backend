import mongoose from "mongoose";
import { IQuizRepository } from "../interfaces/quiz/IQuizRepository";
import { Quiz } from "../models/quizzes";
import { IQuiz } from "../interfaces/quiz/IQuiz";

export class QuizRepository implements IQuizRepository {

  async createQuiz(quizData: Partial<IQuiz>): Promise<string> {
    const quiz = await Quiz.create(quizData);
    return quiz._id.toString();
  }
// async getQuizById(id: string): Promise<IQuiz | null> {
//     return Quiz.findById(id).lean().exec();
//   }

  // async updateQuiz(id: string, data: Partial<IQuiz>): Promise<IQuiz | null> {
  //   return Quiz.findByIdAndUpdate(id, data, { new: true }).lean().exec();
  // }
 

    async deleteQuiz(id: string): Promise<void> {
    await Quiz.findByIdAndDelete(id);
  }
}