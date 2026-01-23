import { ICourseDocument } from "../../models/course";
import { ICourse } from "../../types/course";


export interface ICourseRepository {
  getCourses(params?: {
    search?: string;
    category?: string;
    price?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    courses: ICourseDocument[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;
  getCourse(id: string): Promise<ICourseDocument | null>;
  getCoursesByInstructorId(instructorId: string): Promise<ICourseDocument[]>;
  getCoursesForAdmin(): Promise<ICourseDocument[]>;
  getCoursesByCategoryId(categoryId: string): Promise<ICourseDocument[]>;
  getCoursesByQuizsetId(quizsetId: string): Promise<ICourseDocument[]>;
  getRelatedCourses(
    categoryId: string,
    excludeId: string
  ): Promise<ICourseDocument[]>;
  createCourse(data: Partial<ICourse>): Promise<ICourseDocument>;
  updateCourse(
    id: string,
    data: Partial<ICourse>
  ): Promise<ICourseDocument | null>;
  addTestimonialToCourse(
  courseId: string,
  testimonialId: string
): Promise<void>;
  addModuleToCourse(courseId: string, moduleId: string): Promise<void>;
  removeModuleFromCourse(courseId: string, moduleId: string): Promise<void>;
  deleteCourse(id: string): Promise<void>;
}
