import mongoose from "mongoose";
import { IQuizSetRepository } from "../interfaces/quiz/IQuizsSetRepository";
import { IQuizsetDocument, IQuizsetPopulatedDocument, Quizset } from "../models/quizset";
import { IQuizDocument} from "../models/quizzes";
import { IQuizset } from "../types/quizset";

export class QuizsetRepository implements IQuizSetRepository {
  async getQuizsets(instructorId:string): Promise<IQuizsetDocument[]> {
    return await Quizset.find({instructor:instructorId}).populate("quizIds");
  }

  async getQuizsetById(id: string): Promise<IQuizsetPopulatedDocument | null> {
    return await Quizset.findById(id)
    .populate<{ quizIds: IQuizDocument[] }>("quizIds");
  }

  async createQuizset(data: Partial<IQuizset>): Promise<IQuizsetDocument> {
    const quizset = await Quizset.create(data);
    return quizset;
  }

  async updateQuizset(
    quizsetId: string,
    data: Partial<IQuizset>
  ): Promise<IQuizsetDocument | null> {
    return await Quizset.findByIdAndUpdate(quizsetId, data, { new: true });
  }
  async changeQuizsetPublishState(quizsetId: string): Promise<boolean> {
    const quizset = await Quizset.findById(quizsetId).exec();
    if (!quizset) throw new Error("Quizset not found");
    quizset.active = !quizset.active;
    await quizset.save();
    return quizset.active;
  }

   async deleteQuizset(id: string): Promise<void> {
    await Quizset.findByIdAndDelete(id);
  }

 

  async addQuizToQuizset(quizsetId: string, quizId: string,session?: mongoose.ClientSession): Promise<void> {
     const result =await Quizset.findByIdAndUpdate(
      quizsetId,
      { $addToSet: { quizIds: quizId } },
      { new: true,session }
    );
    return result
  }

 async removeQuizFromQuizset(quizsetId: string, quizId: string): Promise<void> {
    await Quizset.findByIdAndUpdate(
      quizsetId,
      { $pull: { quizIds: quizId } },
      { new: true }
    );
  }

  async findByTitle(title: string): Promise<IQuizsetDocument | null> {
    const query: any = {
      title: { $regex: `^${title.trim()}$`, $options: "i" },
    };

    return await Quizset.findOne(query);
  }
}
