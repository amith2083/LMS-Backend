
import { ILesson } from "../interfaces/lesson/ILesson";
import { ILessonRepository } from "../interfaces/lesson/ILessonRepository";
import { ILessonDocument, Lesson } from "../models/lesson";

export class LessonRepository implements ILessonRepository {
  async createLesson(data: Partial<ILesson>): Promise<string> {
    // Repository doesn't validate moduleId — that's service job
    const lesson = await Lesson.create(data);
    return lesson._id.toString();
  }

  async getLesson(lessonId: string): Promise<ILessonDocument | null> {
    return await Lesson.findById(lessonId);
  }

  async getLessonBySlug(slug: string): Promise<ILessonDocument | null> {
    return await Lesson.findOne({ slug });
  }

  async updateLesson(
    lessonId: string,
    data: Partial<ILesson>
  ): Promise<ILessonDocument | null> {
    return await Lesson.findByIdAndUpdate(lessonId, data, { new: true });
  }

  async deleteLesson(lessonId: string): Promise<void> {
    const result = await Lesson.findByIdAndDelete(lessonId);
    if (!result) {
      throw new Error("Lesson not found"); 
    }
  }

  async findByTitle(title: string): Promise<ILessonDocument | null> {
    return await Lesson.findOne({
      title: { $regex: `^${title}$`, $options: "i" },
    });
  }
}