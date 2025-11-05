import { ILesson } from "../interfaces/lesson/ILesson";
import { ILessonRepository } from "../interfaces/lesson/ILessonRepository";
import { Lesson } from "../models/lesson";


export class LessonRepository implements ILessonRepository {
  async createLesson(data: Partial<ILesson>, moduleId: string): Promise<ILesson> {
    const createdLesson = await Lesson.create(data);
    // const module = await Module.findById(moduleId);
    // if (!module) throw new Error("Module not found");

    // module.lessonIds.push(createdLesson._id);
    // await module.save();

    return JSON.parse(JSON.stringify(createdLesson));
  }

  async getLesson(lessonId: string): Promise<ILesson | null> {
    const lesson = await Lesson.findById(lessonId).lean().exec();
    return lesson
  }
    async getLessonBySlug(slug: string): Promise<ILesson | null> {
    const lesson = await Lesson.findOne({slug:slug}).lean().exec();
    return lesson
  }

  async updateLesson(lessonId: string, data: Partial<ILesson>): Promise<ILesson | null> {
    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, data, { new: true }).lean().exec();
    return updatedLesson 
  }

  // async changeLessonPublishState(lessonId: string): Promise<boolean> {
  //   const lesson = await Lesson.findById(lessonId).exec();
  //   if (!lesson) throw new Error("Lesson not found");

  //   lesson.active = !lesson.active;
  //   await lesson.save();
  //   return lesson.active;
  // }

  async deleteLesson(lessonId: string): Promise<void> {
   
  const deleted = await Lesson.findByIdAndDelete(lessonId);
  if (!deleted) throw new Error("Lesson not found or failed to delete");
  }

  
  async findByTitle(title: string): Promise<ILesson | null> {
  return Lesson.findOne({
    title: { $regex: `^${title}$`, $options: "i" },
  }).lean().exec();
}

}
