import { AppError } from "../utils/asyncHandler";
import { ICourseService } from "../interfaces/course/ICourseService";
import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { IFileUploadService } from "../interfaces/file/IFileUploadService";
import { ICategoryRepository } from "../interfaces/category/ICategoryRepository";
import { ICourseDocument } from "../models/course";
import { CreateCourseResponseDTO, UpdateCourseImageResponse, UpdateCourseResponseDTO } from "../dtos/courseDto";
import { mapCourseDocumentToCreateCourseResponDto, mapCourseDocumentToUpdateCourseResponDto } from "../mappers/courseMapper";
import { ICourse } from "../types/course";


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

  async getCourse(id: string): Promise<ICourseDocument> {
    const course = await this.courseRepository.getCourse(id);
    if (!course) throw new AppError(404, "Course not found");
    return course;
  }

  async getCoursesByInstructorId(instructorId: string): Promise<ICourseDocument[]> {
    const courses = await this.courseRepository.getCoursesByInstructorId(
      instructorId
    );
    return courses;
  }

  async getCoursesForAdmin(): Promise<ICourseDocument[]> {
    const courses = await this.courseRepository.getCoursesForAdmin();
    return courses;
  }
  async getRelatedCourses(currentCourseId: string): Promise<ICourseDocument[]> {
  const currentCourse = await this.courseRepository.getCourse(currentCourseId);
 
  if (!currentCourse || !currentCourse.category) return [];

  return await this.courseRepository.getRelatedCourses(
    currentCourse.category._id.toString(),
    currentCourseId
  );
}

  async createCourse(data: Partial<ICourse>): Promise<CreateCourseResponseDTO|null> {
     const result =await this.courseRepository.createCourse(data);
     return result ? mapCourseDocumentToCreateCourseResponDto(result):null
  }

  async updateCourse(id: string, data: Partial<ICourse>): Promise<UpdateCourseResponseDTO|null> {
    const updated = await this.courseRepository.updateCourse(id, data);
    if (!updated) throw new AppError(404, "Course not found");
    return updated ?mapCourseDocumentToUpdateCourseResponDto(updated):null
  }

  async updateCourseImage(
    courseId: string,
    file: Express.Multer.File
  ): Promise<UpdateCourseImageResponse> {
    if (!file) throw new AppError(400, "Image file is required");

    const imageUrl = await this.fileUploadService.uploadFile(
      file,
      "lms/courses"
    );
    const updated = await this.courseRepository.updateCourse(courseId, {
      thumbnail: imageUrl,
    });
   
if (!updated?.thumbnail) {
  throw new AppError(500, "Course image update failed");
}

return {
  _id: updated._id.toString(),
  thumbnail: updated.thumbnail,
};
  }

  async deleteCourse(id: string): Promise<void> {
    const course = await this.courseRepository.getCourse(id);
    if (!course) throw new AppError(404, "Course not found");
    await this.courseRepository.deleteCourse(id);
  }
}
