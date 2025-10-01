import { IEnrollment } from "./IEnrollment";

export interface IEnrollmentService {
 createEnrollment(data: Partial<IEnrollment>): Promise<IEnrollment | { sessionUrl: string }>
    confirmEnrollment(sessionId: string, userId: string): Promise<IEnrollment>;
  getEnrollment(enrollmentId: string): Promise<IEnrollment | null>;
  getEnrollmentsForCourse(courseId: string): Promise<IEnrollment[]>;
  getEnrollmentsForUser(userId: string): Promise<IEnrollment[]>;
  // updateEnrollment(enrollmentId: string, data: Partial<IEnrollment>): Promise<IEnrollment | null>;
  // deleteEnrollment(enrollmentId: string): Promise<void>;
}