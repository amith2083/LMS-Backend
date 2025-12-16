import mongoose from "mongoose";
import { IQuizSetRepository } from "../interfaces/quiz/IQuizsSetRepository";
import { IQuizset } from "../interfaces/quiz/IQuizset";
import { Quizset } from "../models/quizset";
import { Quiz } from "../models/quizzes";

export class QuizsetRepository implements IQuizSetRepository {
  async getQuizsets(instructorId:string): Promise<IQuizset[]> {
    return Quizset.find({instructor:instructorId}).populate("quizIds").lean().exec();
  }

  async getQuizsetById(id: string): Promise<IQuizset | null> {
    return Quizset.findById(id).populate("quizIds").lean().exec();
  }

  async createQuizset(data: Partial<IQuizset>): Promise<IQuizset> {
    const quizset = await Quizset.create(data);
    return quizset;
  }

  async updateQuizset(
    quizsetId: string,
    data: Partial<IQuizset>
  ): Promise<IQuizset | null> {
    return Quizset.findByIdAndUpdate(quizsetId, data, { new: true })
      .lean()
      .exec();
  }
  async changeQuizsetPublishState(quizsetId: string): Promise<boolean> {
    const quizset = await Quizset.findById(quizsetId).exec();
    if (!quizset) throw new Error("Quizset not found");
    quizset.active = !quizset.active;
    await quizset.save();
    return quizset.active;
  }

   async deleteQuizset(id: string): Promise<void> {
    await Quizset.findByIdAndDelete(id).exec();
  }

 

  async addQuizToQuizset(quizsetId: string, quizId: string,session?: mongoose.ClientSession): Promise<void> {
     const result =await Quizset.findByIdAndUpdate(
      quizsetId,
      { $addToSet: { quizIds: quizId } },
      { new: true,session }
    ).lean().exec();
    return result
  }

 async removeQuizFromQuizset(quizsetId: string, quizId: string): Promise<void> {
    await Quizset.findByIdAndUpdate(
      quizsetId,
      { $pull: { quizIds: quizId } },
      { new: true }
    ).exec();
  }

  async findByTitle(title: string): Promise<IQuizset | null> {
    const query: any = {
      title: { $regex: `^${title.trim()}$`, $options: "i" },
    };

    return Quizset.findOne(query).lean().exec();
  }
}
