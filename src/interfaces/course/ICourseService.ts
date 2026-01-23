import { CreateCourseResponseDTO, UpdateCourseImageResponse, UpdateCourseResponseDTO } from "../../dtos/courseDto";
import { ICourseDocument } from "../../models/course";
import { ICourse } from "../../types/course";



export interface ICourseService {
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
   getCoursesByInstructorId(instructorId: string): Promise<ICourseDocument[]>
   getCoursesForAdmin(): Promise<ICourseDocument[]>
   getRelatedCourses(currentCourseId: string): Promise<ICourseDocument[]>
  createCourse(data: Partial<ICourse>): Promise<CreateCourseResponseDTO|null>;
  updateCourse(id: string, data: Partial<ICourse>): Promise<UpdateCourseResponseDTO | null>;
 updateCourseImage(courseId: string, file: Express.Multer.File): Promise<UpdateCourseImageResponse>
  deleteCourse(id: string): Promise<void>;
}