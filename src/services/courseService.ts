import { AppError } from "../utils/asyncHandler";
import { ICourseService } from "../interfaces/course/ICourseService";
import { ICourse } from "../interfaces/course/ICourse";
import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { IFileUploadService } from "../interfaces/file/IFileUploadService";
import { ICategoryRepository } from "../interfaces/category/ICategoryRepository";


export class CourseService implements ICourseService {
  constructor(
    private courseRepository: ICourseRepository,
     private categoryRepository: ICategoryRepository,
    private fileUploadService: IFileUploadService
   
  ) {}

  async getCourses(params?: {
    search?: string;
    category?: string;
    price?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    // Validate category exists
    if (params?.category) {
      const cat = await this.categoryRepository.getCategory(params.category);
      if (!cat) throw new AppError(404, "Category not found");
    }

    return this.courseRepository.getCourses(params);
  }

  async getCourse(id: string): Promise<ICourse> {
    const course = await this.courseRepository.getCourse(id);
    if (!course) throw new AppError(404, "Course not found");
    return course;
  }

  async getCoursesByInstructorId(instructorId: string): Promise<ICourse[]> {
    const courses = await this.courseRepository.getCoursesByInstructorId(
      instructorId
    );
    return courses;
  }

  async getCoursesForAdmin(): Promise<ICourse[]> {
    const courses = await this.courseRepository.getCoursesForAdmin();
    return courses;
  }
  async getRelatedCourses(currentCourseId: string): Promise<ICourse[]> {
  const currentCourse = await this.courseRepository.getCourse(currentCourseId);
 
  if (!currentCourse || !currentCourse.category) return [];

  return this.courseRepository.getRelatedCourses(
    currentCourse.category._id.toString(),
    currentCourseId
  );
}

  async createCourse(data: Partial<ICourse>): Promise<ICourse> {
    return this.courseRepository.createCourse(data);
  }

  async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse> {
    const updated = await this.courseRepository.updateCourse(id, data);
    if (!updated) throw new AppError(404, "Course not found");
    return updated;
  }

  async updateCourseImage(
    courseId: string,
    file: Express.Multer.File
  ): Promise<ICourse> {
    if (!file) throw new AppError(400, "Image file is required");

    const imageUrl = await this.fileUploadService.uploadFile(
      file,
      "lms/courses"
    );
    const updated = await this.courseRepository.updateCourse(courseId, {
      thumbnail: imageUrl,
    });
    if (!updated) throw new AppError(404, "Course not found");
    return updated;
  }

  async deleteCourse(id: string): Promise<void> {
    const course = await this.courseRepository.getCourse(id);
    if (!course) throw new AppError(404, "Course not found");
    await this.courseRepository.deleteCourse(id);
  }
}
