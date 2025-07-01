import { ICourse } from "../interfaces/course/ICourse";
import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { ICourseService } from "../interfaces/course/ICourseService";
import { CourseRepository } from "../repositories/courseRepository";


export class CourseService implements ICourseService {
   private courseRepository: ICourseRepository;

  constructor(courseRepository: ICourseRepository) {
    this.courseRepository = courseRepository;
  }

  async getCourses(): Promise<ICourse[]> {
    return this.courseRepository.getCourses();
  }

  async getCourse(id: string): Promise<ICourse | null> {
    return this.courseRepository.getCourse(id);
  }

  async createCourse(data: Partial<ICourse>): Promise<ICourse> {
    return this.courseRepository.createCourse(data);
  }

  async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
    return this.courseRepository.updateCourse(id, data);
  }

  async deleteCourse(id: string): Promise<void> {
    return this.courseRepository.deleteCourse(id);
  }
}
