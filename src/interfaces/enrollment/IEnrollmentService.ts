import { IEnrollmentDocument } from "../../models/enrollment";
import { IEnrollment } from "../../types/enrollment";

export interface IEnrollmentService {
  createEnrollment(data: IEnrollment): Promise<{ sessionUrl: string }>;
  confirmEnrollment(
    sessionId: string,
    userId: string,
  ): Promise<IEnrollmentDocument>;
  getAllEnrollments(): Promise<IEnrollmentDocument[] | null>;
  getEnrollment(enrollmentId: string): Promise<IEnrollmentDocument | null>;
  getEnrollmentsForCourse(courseId: string): Promise<IEnrollmentDocument[]>;
  getEnrollmentsForUser(userId: string): Promise<IEnrollmentDocument[]>;
  hasEnrollmentForCourse(courseId: string, studentId: string): Promise<boolean>;
}
