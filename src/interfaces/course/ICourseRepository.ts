
import { ICourse } from "./ICourse";


export interface ICourseRepository {
  getCourses(): Promise<ICourse[]>;
getCourse(id: string): Promise<ICourse | null>;
getCoursesByInstructorId(instructorId: string): Promise<ICourse[]>
getCourseForAdminById(id: string): Promise<ICourse | null>
  createCourse(data: Partial<ICourse>): Promise<ICourse>;
  updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null>;
  deleteCourse(id: string): Promise<void>;
}
