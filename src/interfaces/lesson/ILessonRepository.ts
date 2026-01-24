import { ILessonDocument } from "../../models/lesson";
import { ILesson } from "./ILesson";


export interface ILessonRepository {
  createLesson(data: Partial<ILesson>): Promise<string>;
  getLesson(lessonId: string): Promise<ILessonDocument | null>;
  getLessonBySlug(slug: string): Promise<ILessonDocument | null>;
  updateLesson(lessonId: string, data: Partial<ILesson>): Promise<ILessonDocument | null>;
  // changeLessonPublishState(lessonId: string): Promise<boolean>;
  deleteLesson(lessonId: string): Promise<void>;
  findByTitle(title: string): Promise<ILessonDocument | null>;

}
