
import { IEnrollment } from "../interfaces/enrollment/IEnrollment";
import { IEnrollmentRepository } from "../interfaces/enrollment/IEnrollmentRepository";
import { IEnrollmentService } from "../interfaces/enrollment/IEnrollmentService";
import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { createCheckoutSession, stripe } from "../utils/stripe";
import { sendEmails } from "../utils/sendEmails";

export class EnrollmentService implements IEnrollmentService {
  constructor(
    private enrollmentRepository: IEnrollmentRepository,
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository
  ) {}

  // async createEnrollment(data: Partial<IEnrollment>): Promise<IEnrollment> {
  //   if (!data.course || !data.student || !data.method) {
  //     throw new Error("Course, student, and payment method are required");
  //   }

  //   const course = await this.courseRepository.getCourse(data.course.toString());
  //   if (!course) throw new Error("Course not found");

  //   const user = await this.userRepository.getUserById(data.student.toString());
  //   if (!user) throw new Error("User not found");

  //   if (!["credit-card", "paypal", "stripe"].includes(data.method)) {
  //     throw new Error("Invalid payment method");
  //   }

  //   const existing = await this.enrollmentRepository.findByCourseAndUser(
  //     data.course.toString(),
  //     data.student.toString()
  //   );
  //   if (existing) {
  //     throw new Error("User is already enrolled in this course");
  //   }

  //   return this.enrollmentRepository.createEnrollment(data);
  // }
async createEnrollment(data: Partial<IEnrollment>): Promise<IEnrollment | { sessionUrl: string }> {
    if (!data.course || !data.student || !data.method) {
      throw new Error("Course, student, and payment method are required");
    }

    const course = await this.courseRepository.getCourse(data.course.toString());
    if (!course) throw new Error("Course not found");

    const user = await this.userRepository.getUserById(data.student.toString());
    if (!user) throw new Error("User not found");

    if (!["credit-card", "paypal", "stripe"].includes(data.method)) {
      throw new Error("Invalid payment method");
    }

    const existing = await this.enrollmentRepository.findByCourseAndUser(
      data.course.toString(),
      data.student.toString()
    );
    if (existing) {
      throw new Error("User is already enrolled in this course");
    }

    if (course.price === 0 || data.method !== 'stripe') {
      return this.enrollmentRepository.createEnrollment(data);
    } else {
      const session = await createCheckoutSession(
        course.title,
        course.price,
        { courseId: data.course.toString(), userId: data.student.toString() }
      );
      return { sessionUrl: session.url! };
    }
  }

  // async confirmEnrollment(sessionId: string, userId: string): Promise<IEnrollment> {
  //   const session = await stripe.checkout.sessions.retrieve(sessionId);
  //   if (session.payment_status !== 'paid') {
  //     throw new Error('Payment not completed');
  //   }

  //   const { courseId, userId: metadataUserId } = session.metadata as { courseId: string; userId: string };
  //   if (metadataUserId !== userId) {
  //     throw new Error('User mismatch');
  //   }

  //   const data: Partial<IEnrollment> = {
  //     course: courseId,
  //     student: userId,
  //     method: 'stripe',
  //     enrollment_date: new Date(),
  //     status: 'not-started',
  //   };

  //   return this.enrollmentRepository.createEnrollment(data);
  // }
 async confirmEnrollment(sessionId: string, userId: string): Promise<IEnrollment> {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    const { courseId, userId: metadataUserId } = session.metadata as { courseId: string; userId: string };
    if (metadataUserId !== userId) {
      throw new Error("User mismatch");
    }

    const data: Partial<IEnrollment> = {
      course: courseId,
      student: userId,
      method: "stripe",
      enrollment_date: new Date(),
      status: "not-started",
    };

    const enrollment = await this.enrollmentRepository.createEnrollment(data);

    // Fetch course and user for email details
    const course = await this.courseRepository.getCourse(courseId);
    if (!course) throw new Error("Course not found");
    const student = await this.userRepository.getUserById(userId);
    if (!student) throw new Error("User not found");

    const instructorName = course.instructor?.name || "Instructor";
    const instructorEmail = course.instructor?.email;
    const studentName = student.name || "Student";
    const studentEmail = student.email;
    const productName = course.title;

    const emailsToSend = [
      {
        to: instructorEmail,
        subject: `New Enrollment For ${productName}`,
        message: `Congratulations, ${instructorName}. A new student, ${studentName}, has enrolled in your course ${productName} just now.`,
      },
      {
        to: studentEmail,
        subject: `Enrollment Success for ${productName}`,
        message: `Hey, ${studentName}. You have successfully enrolled in the course ${productName}.`,
      },
    ];

    try {
      await sendEmails(emailsToSend); // Use the updated sendEmails
    } catch (emailError) {
      console.error("Failed to send emails:", emailError);
      // Don't throw; let enrollment succeed even if emails fail
    }

    return enrollment;
  }

  async getEnrollment(enrollmentId: string): Promise<IEnrollment | null> {
    const enrollment = await this.enrollmentRepository.getEnrollment(enrollmentId);
    if (!enrollment) throw new Error("Enrollment not found");
    return enrollment;
  }

  async getEnrollmentsForCourse(courseId: string): Promise<IEnrollment[]> {
    const course = await this.courseRepository.getCourse(courseId);
    if (!course) throw new Error("Course not found");
    return this.enrollmentRepository.getEnrollmentsForCourse(courseId);
  }

  async getEnrollmentsForUser(userId: string): Promise<IEnrollment[]> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new Error("User not found");
    return this.enrollmentRepository.getEnrollmentsForUser(userId);
  }
 async hasEnrollmentForCourse(courseId: string, studentId: string): Promise<boolean> {
    return this.enrollmentRepository.hasEnrollmentForCourse(courseId, studentId);
  }

}
