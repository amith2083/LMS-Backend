import { ILesson } from "../interfaces/lesson/ILesson";
import { ILessonRepository } from "../interfaces/lesson/ILessonRepository";
import { ILessonService } from "../interfaces/lesson/ILessonService";

export class LessonService implements ILessonService {
  private lessonRepository: ILessonRepository;

  constructor(lessonRepository: ILessonRepository) {
    this.lessonRepository = lessonRepository;
  }

  async createLesson(
    data: Partial<ILesson>,
    moduleId: string
  ): Promise<ILesson> {
    if (!data.title) throw new Error("Lesson title is required");

    const existing = await this.lessonRepository.findByTitle(data.title);
    if (existing) {
      throw new Error("A lesson with this title already exists.");
    }

    if (existing) {
      throw new Error("A lesson with this title already exists.");
    }

    // Optionally auto-generate slug
    // if (!data.slug && data.title) {
    //   data.slug = slugify(data.title, { lower: true, strict: true });
    // }

    return this.lessonRepository.createLesson(data, moduleId);
  }

  async getLesson(lessonId: string): Promise<ILesson | null> {
    const lesson = await this.lessonRepository.getLesson(lessonId);
    if (!lesson) throw new Error("Lesson not found");
    return lesson;
  }

  async updateLesson(
    lessonId: string,
    data: Partial<ILesson>
  ): Promise<ILesson | null> {
    return this.lessonRepository.updateLesson(lessonId, data);
  }

  async changeLessonPublishState(lessonId: string): Promise<boolean> {
    return this.lessonRepository.changeLessonPublishState(lessonId);
  }

  async deleteLesson(lessonId: string, moduleId: string): Promise<void> {
    return this.lessonRepository.deleteLesson(lessonId, moduleId);
  }
}
