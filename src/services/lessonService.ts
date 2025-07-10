import { ILesson } from "../interfaces/lesson/ILesson";
import { ILessonRepository } from "../interfaces/lesson/ILessonRepository";
import { ILessonService } from "../interfaces/lesson/ILessonService";
import { IModuleRepository } from "../interfaces/module/IModuleRepository";

export class LessonService implements ILessonService {
 private lessonRepository: ILessonRepository;
  private moduleRepository: IModuleRepository;

  constructor(
    lessonRepository: ILessonRepository,
    moduleRepository: IModuleRepository
  ) {
    this.lessonRepository = lessonRepository;
    this.moduleRepository = moduleRepository;
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

      const module = await this.moduleRepository.getModule(moduleId);
  if (!module) throw new Error("Module not found");
    // Optionally auto-generate slug
    // if (!data.slug && data.title) {
    //   data.slug = slugify(data.title, { lower: true, strict: true });
    // }

    const lesson  = await this.lessonRepository.createLesson(data, moduleId);
      module.lessonIds.push(lesson._id);
      await this.moduleRepository.saveModule(module);
return lesson;
      
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

  // async changeLessonPublishState(lessonId: string): Promise<boolean> {
  //   return this.lessonRepository.changeLessonPublishState(lessonId);
  // }

  async deleteLesson(lessonId: string, moduleId: string): Promise<void> {
   const module = await this.moduleRepository.getModule(moduleId);
  if (!module) throw new Error("Module not found");

  // Remove the lesson ID from the module
  // module.lessonIds = module.lessonIds.filter(id => id.toString() !== lessonId);
  
  module.lessonIds = module.lessonIds.filter(id => !id.equals(lessonId));
  await this.moduleRepository.saveModule(module); // Save the updated module

  await this.lessonRepository.deleteLesson(lessonId);
}
}
