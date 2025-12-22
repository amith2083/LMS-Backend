
import { IEnrollment } from "./IEnrollment";

export interface IEnrollmentRepository {
  createEnrollment(data: Partial<IEnrollment>): Promise<IEnrollment>;
   getAllEnrollments(): Promise<IEnrollment[] | null>
  getEnrollment(enrollmentId: string): Promise<IEnrollment | null>;
  getEnrollmentsForCourse(courseId: string): Promise<IEnrollment[]>;
  getEnrollmentsForUser(userId: string): Promise<IEnrollment[]>;
 hasEnrollmentForCourse(courseId: string, studentId: string): Promise<boolean>
  // updateEnrollment(enrollmentId: string, data: Partial<IEnrollment>): Promise<IEnrollment | null>;
  // deleteEnrollment(enrollmentId: string): Promise<void>;
  findByCourseAndUser(courseId: string, userId: string): Promise<IEnrollment | null>;
}