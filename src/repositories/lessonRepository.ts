// src/repositories/lessonRepository.ts
import { ILesson } from "../interfaces/lesson/ILesson";
import { ILessonRepository } from "../interfaces/lesson/ILessonRepository";
import { Lesson } from "../models/lesson";

export class LessonRepository implements ILessonRepository {
  async createLesson(data: Partial<ILesson>, moduleId: string): Promise<ILesson> {
    // Repository doesn't validate moduleId — that's service job
    const lesson = await Lesson.create(data);
    return lesson.toObject(); // ← Clean plain object, no Mongoose stuff
  }

  async getLesson(lessonId: string): Promise<ILesson | null> {
    return await Lesson.findById(lessonId).lean().exec();
  }

  async getLessonBySlug(slug: string): Promise<ILesson | null> {
    return await Lesson.findOne({ slug }).lean().exec();
  }

  async updateLesson(
    lessonId: string,
    data: Partial<ILesson>
  ): Promise<ILesson | null> {
    return await Lesson.findByIdAndUpdate(lessonId, data, { new: true })
      .lean()
      .exec();
  }

  async deleteLesson(lessonId: string): Promise<void> {
    const result = await Lesson.findByIdAndDelete(lessonId).exec();
    if (!result) {
      throw new Error("Lesson not found"); // ← OK here: DB-level error
    }
  }

  async findByTitle(title: string): Promise<ILesson | null> {
    return await Lesson.findOne({
      title: { $regex: `^${title}$`, $options: "i" },
    })
      .lean()
      .exec();
  }
}