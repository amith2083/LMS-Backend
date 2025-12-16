
import { AppError } from '../utils/asyncHandler';
import { IEnrollment } from '../interfaces/enrollment/IEnrollment';
import { IEnrollmentRepository } from '../interfaces/enrollment/IEnrollmentRepository';
import { ICourseRepository } from '../interfaces/course/ICourseRepository';
import { IUserRepository } from '../interfaces/user/IUserRepository';
import {  createCheckoutSession, stripe } from '../utils/stripe';
import { sendEmails } from '../utils/sendEmails';
import { STATUS_CODES } from '../constants/http';
import { IEnrollmentService } from '../interfaces/enrollment/IEnrollmentService';


export class EnrollmentService implements IEnrollmentService {
  constructor(
    private enrollmentRepository: IEnrollmentRepository,
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository
  ) {}

  async createEnrollment(data: Partial<IEnrollment>): Promise<IEnrollment | { clientSecret: string }> {
    if (!data.course || !data.student || !data.method) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Course, student, and payment method are required');
    }
  const existing = await this.enrollmentRepository.findByCourseAndUser(
      data.course.toString(),
      data.student.toString()
    );
    if (existing) {
      throw new AppError(STATUS_CODES.CONFLICT, 'User is already enrolled in this course');
    }
    const course = await this.courseRepository.getCourse(data.course.toString());
    if (!course) throw new AppError(STATUS_CODES.NOT_FOUND, 'Course not found');

    const user = await this.userRepository.getUserById(data.student.toString());
    if (!user) throw new AppError(STATUS_CODES.NOT_FOUND, 'User not found');

    if (!['credit-card', 'paypal', 'stripe'].includes(data.method)) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Invalid payment method');
    }

  

   
      const session = await createCheckoutSession(
        course.title,
        course.price,
        
        { courseId: data.course.toString(), userId: data.student.toString() }
      );
      return { sessionUrl: session.url! };

    

    
  }

  async confirmEnrollment(sessionId: string, userId: string): Promise<IEnrollment> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Payment not completed');
    }

    const { courseId, userId: metadataUserId } = session.metadata as { courseId: string; userId: string };
    if (metadataUserId !== userId) {
      throw new AppError(STATUS_CODES.FORBIDDEN, 'User mismatch');
    }

    const data: Partial<IEnrollment> = {
      course: courseId,
      student: userId,
      method: 'stripe',
      enrollment_date: new Date(),
      status: 'completed',
    };

    const enrollment = await this.enrollmentRepository.createEnrollment(data);

    // Send emails (non-blocking)
    try {
      const course = await this.courseRepository.getCourse(courseId);
      const student = await this.userRepository.getUserById(userId);
      if (course && student) {
        const instructorName = course.instructor?.name || 'Instructor';
        const instructorEmail = course.instructor?.email;
        const studentName = student.name || 'Student';
        const studentEmail = student.email;
        const productName = course.title;

        await sendEmails([
          {
            to: instructorEmail,
            subject: `New Enrollment For ${productName}`,
            message: `Congratulations, ${instructorName}. A new student, ${studentName}, has enrolled in your course ${productName}.`,
          },
          {
            to: studentEmail,
            subject: `Enrollment Success for ${productName}`,
            message: `Hey, ${studentName}. You have successfully enrolled in the course ${productName}.`,
          },
        ]);
      }
    } catch (emailError) {
      console.error('Failed to send enrollment emails:', emailError);
      // Don't fail enrollment
    }

    return enrollment;
  }

  async getEnrollment(enrollmentId: string): Promise<IEnrollment> {
    const enrollment = await this.enrollmentRepository.getEnrollment(enrollmentId);
    if (!enrollment) throw new AppError(STATUS_CODES.NOT_FOUND, 'Enrollment not found');
    return enrollment;
  }

  async getEnrollmentsForCourse(courseId: string): Promise<IEnrollment[]> {
    const course = await this.courseRepository.getCourse(courseId);
    if (!course) throw new AppError(STATUS_CODES.NOT_FOUND, 'Course not found');
    return this.enrollmentRepository.getEnrollmentsForCourse(courseId);
  }

  async getEnrollmentsForUser(userId: string): Promise<IEnrollment[]> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new AppError(STATUS_CODES.NOT_FOUND, 'User not found');
    return this.enrollmentRepository.getEnrollmentsForUser(userId);
  }

  async hasEnrollmentForCourse(courseId: string, studentId: string): Promise<boolean> {
    return this.enrollmentRepository.hasEnrollmentForCourse(courseId, studentId);
  }
}