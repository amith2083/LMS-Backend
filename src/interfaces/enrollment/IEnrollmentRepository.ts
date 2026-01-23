
import { IEnrollmentDocument } from "../../models/enrollment";
import { IEnrollment } from "./IEnrollment";

export interface IEnrollmentRepository {
  createEnrollment(data:IEnrollment): Promise<IEnrollmentDocument>;
   getAllEnrollments(): Promise<IEnrollmentDocument[] | null>
  getEnrollment(enrollmentId: string): Promise<IEnrollmentDocument | null>;
  getEnrollmentsForCourse(courseId: string): Promise<IEnrollmentDocument[]>;
  getEnrollmentsForUser(userId: string): Promise<IEnrollmentDocument[]>;
 hasEnrollmentForCourse(courseId: string, studentId: string): Promise<boolean>
  // updateEnrollment(enrollmentId: string, data: Partial<IEnrollment>): Promise<IEnrollment | null>;
  // deleteEnrollment(enrollmentId: string): Promise<void>;
  findByCourseAndUser(courseId: string, userId: string): Promise<IEnrollmentDocument | null>;
}