
import { AppError } from '../utils/asyncHandler';
import { IEnrollment } from '../interfaces/enrollment/IEnrollment';
import { IEnrollmentRepository } from '../interfaces/enrollment/IEnrollmentRepository';
import { ICourseRepository } from '../interfaces/course/ICourseRepository';
import { IUserRepository } from '../interfaces/user/IUserRepository';
import {  createCheckoutSession, stripe } from '../utils/stripe';
import { sendEmails } from '../utils/sendEmails';
import { STATUS_CODES } from '../constants/http';
import { IEnrollmentService } from '../interfaces/enrollment/IEnrollmentService';
import { IPayoutRepository } from '../interfaces/payout/IPayoutRepository';


export class EnrollmentService implements IEnrollmentService {
  constructor(
    private enrollmentRepository: IEnrollmentRepository,
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository,
    private payoutRepository: IPayoutRepository,
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
    // Retrieve session with expanded payment data
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    if (session.payment_status !== 'paid') {
      throw new AppError(STATUS_CODES.PAYMENT_REQUIRED, 'Payment not completed');
    }

    const courseId = session.metadata?.courseId;
    const metadataUserId = session.metadata?.userId;

    if (!courseId || !metadataUserId) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Invalid session metadata');
    }

    if (metadataUserId !== userId) {
      throw new AppError(STATUS_CODES.FORBIDDEN, 'User ID mismatch');
    }

    // Prevent duplicate processing
    const existingEnrollment = await this.enrollmentRepository.findByCourseAndUser(courseId, userId);
    if (existingEnrollment) {
      return existingEnrollment; // Idempotent
    }

    const course = await this.courseRepository.getCourse(courseId);
    if (!course) throw new AppError(STATUS_CODES.NOT_FOUND, 'Course not found');

    const student = await this.userRepository.getUserById(userId);
    if (!student) throw new AppError(STATUS_CODES.NOT_FOUND, 'Student not found');

    const instructor = course.instructor; // populated or fetched

    // Calculate revenue split
    const totalAmount = session.amount_total! / 100; // Stripe uses cents
    const platformFee = totalAmount * 0.25;
    const instructorAmount = totalAmount - platformFee;

    // Create enrollment
    const enrollment = await this.enrollmentRepository.createEnrollment({
      course: courseId,
      student: userId,
      method: 'stripe',
      enrollment_date: new Date(),
      status: 'completed', 
    });

    // Record payout (revenue split)
    if (this.payoutRepository && instructor) {
      try {
        await this.payoutRepository.createPayout({
          instructor: instructor._id.toString(),
          course: courseId,
          enrollment: enrollment._id.toString(),
          totalAmount,
          platformFee,
          amount: instructorAmount,
          status: 'pending',
        });

      
      } catch (error) {
        console.error('Failed to record payout:', error);
        // Don't fail enrollment if payout recording fails
      }
    }

    // Send notification emails (fire and forget)
    if (instructor?.email && student.email) {
      sendEmails([
        {
          to: instructor.email,
          subject: `New Enrollment: ${course.title}`,
          message: `Great news! ${student.name} just enrolled in your course "${course.title}". You've earned $${instructorAmount.toFixed(2)}.`,
        },
        {
          to: student.email,
          subject: `Welcome to ${course.title}!`,
          message: `Hi ${student.name},\n\nYou've successfully enrolled in "${course.title}". Start learning now!\n\nLink: ${process.env.NEXT_PUBLIC_URL}/courses/${courseId}/lesson`,
        },
      ]).catch(err => console.error('Email send failed:', err));
    }

    return enrollment;
  }

  // async confirmEnrollment(sessionId: string, userId: string): Promise<IEnrollment> {
  //   const session = await stripe.checkout.sessions.retrieve(sessionId);
  //   if (session.payment_status !== 'paid') {
  //     throw new AppError(STATUS_CODES.BAD_REQUEST, 'Payment not completed');
  //   }

  //   const { courseId, userId: metadataUserId } = session.metadata as { courseId: string; userId: string };
  //   if (metadataUserId !== userId) {
  //     throw new AppError(STATUS_CODES.FORBIDDEN, 'User mismatch');
  //   }
    

  //   const data: Partial<IEnrollment> = {
  //     course: courseId,
  //     student: userId,
  //     method: 'stripe',
  //     enrollment_date: new Date(),
  //     status: 'completed',
  //   };

  //   const enrollment = await this.enrollmentRepository.createEnrollment(data);

  //   // Send emails (non-blocking)
  //   try {
  //     const course = await this.courseRepository.getCourse(courseId);
  //     const student = await this.userRepository.getUserById(userId);
  //     if (course && student) {
  //       const instructorName = course.instructor?.name || 'Instructor';
  //       const instructorEmail = course.instructor?.email;
  //       const studentName = student.name || 'Student';
  //       const studentEmail = student.email;
  //       const productName = course.title;

  //       await sendEmails([
  //         {
  //           to: instructorEmail,
  //           subject: `New Enrollment For ${productName}`,
  //           message: `Congratulations, ${instructorName}. A new student, ${studentName}, has enrolled in your course ${productName}.`,
  //         },
  //         {
  //           to: studentEmail,
  //           subject: `Enrollment Success for ${productName}`,
  //           message: `Hey, ${studentName}. You have successfully enrolled in the course ${productName}.`,
  //         },
  //       ]);
  //     }
  //   } catch (emailError) {
  //     console.error('Failed to send enrollment emails:', emailError);
  //     // Don't fail enrollment
  //   }

  //   return enrollment;
  // }
 async getAllEnrollments(): Promise<IEnrollment[] |null> {
    const enrollments = await this.enrollmentRepository.getAllEnrollments();
    if (!enrollments) throw new AppError(STATUS_CODES.NOT_FOUND, 'Enrollments not found');
    return enrollments;
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