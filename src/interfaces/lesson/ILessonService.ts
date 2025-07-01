import { ILesson } from "./ILesson";


export interface ILessonService {
  createLesson(data: Partial<ILesson>, moduleId: string): Promise<ILesson>;
  getLesson(lessonId: string): Promise<ILesson | null>;
  updateLesson(lessonId: string, data: Partial<ILesson>): Promise<ILesson | null>;
  changeLessonPublishState(lessonId: string): Promise<boolean>;
  deleteLesson(lessonId: string, moduleId: string): Promise<void>;
}
