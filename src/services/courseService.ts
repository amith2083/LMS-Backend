import { ICourse } from "../interfaces/course/ICourse";
import { ICourseRepository } from "../interfaces/course/ICourseRepository";

import { ICourseService } from "../interfaces/course/ICourseService";
import { IFileUploadService } from "../interfaces/file/IFileUploadService";


export class CourseService implements ICourseService {
  // private courseRepository: ICourseRepository;
  // private fileUploadService: IFileUploadService;

  // constructor(courseRepository: ICourseRepository) {
  //   this.courseRepository = courseRepository;
  // }

    constructor(
      private courseRepository : ICourseRepository,
      private fileUploadService: IFileUploadService,
    
    ) {}

  async getCourses(): Promise<ICourse[]> {
    return this.courseRepository.getCourses();
  }

  async getCourse(id: string): Promise<ICourse | null> {
    return this.courseRepository.getCourse(id);
  }

  async createCourse(data: Partial<ICourse>): Promise<ICourse> {
    return this.courseRepository.createCourse(data);
  }

  async updateCourse(
    id: string,
    data: Partial<ICourse>
  ): Promise<ICourse | null> {
    return this.courseRepository.updateCourse(id, data);
  }
async updateCourseImage(courseId: string, file: Express.Multer.File): Promise<ICourse | null> {
    const imageUrl = await this.fileUploadService.uploadFile(file, "lms/courses");
    return this.courseRepository.updateCourse(courseId, { thumbnail: imageUrl });
  }
  async deleteCourse(id: string): Promise<void> {
    return this.courseRepository.deleteCourse(id);
  }
  async getCoursesByInstructorId(instructorId: string): Promise<ICourse[]> {
    return this.courseRepository.getCoursesByInstructorId(instructorId);
  }

  // New method to get course for admin by ID with status true
  async getCourseForAdminById(id: string): Promise<ICourse | null> {
    return this.courseRepository.getCourseForAdminById(id);
  }
}