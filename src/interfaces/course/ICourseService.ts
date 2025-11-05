import { ICourse } from "./ICourse";

;

export interface ICourseService {
getCourses(params?: {
  search?: string;
  categories?: string[];
  price?: string[];
  sort?: string;
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
   getCourseForAdminById(id: string): Promise<ICourse | null>
  createCourse(data: Partial<ICourse>): Promise<ICourse>;
  updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null>;
 updateCourseImage(courseId: string, file: Express.Multer.File): Promise<ICourse | null>
  deleteCourse(id: string): Promise<void>;
}