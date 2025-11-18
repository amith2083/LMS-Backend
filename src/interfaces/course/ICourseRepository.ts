
import { ICourse } from "./ICourse";


export interface ICourseRepository {
 getCourses(params?: {
    search?: string;
    category?: string;
    price?: string; // 'free' | 'paid'
    sort?: string; // 'price-asc' | 'price-desc'
    page?: number;
    limit?: number;
  }): Promise<{
    courses: ICourse[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;
getCourse(id: string): Promise<ICourse | null>;
getCoursesByInstructorId(instructorId: string): Promise<ICourse[]>
getCoursesForAdmin(): Promise<ICourse[]>
getCoursesByCategoryId(categoryId: string): Promise<ICourse[]>;
getCoursesByQuizsetId(quizsetId: string): Promise<ICourse[]>
  createCourse(data: Partial<ICourse>): Promise<ICourse>;
  updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null>;
  deleteCourse(id: string): Promise<void>;
}
