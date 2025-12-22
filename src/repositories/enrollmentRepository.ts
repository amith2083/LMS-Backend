
import mongoose from 'mongoose';
import { IEnrollment } from '../interfaces/enrollment/IEnrollment';
import { IEnrollmentRepository } from '../interfaces/enrollment/IEnrollmentRepository';
import { ICourseRepository } from '../interfaces/course/ICourseRepository';
import { IUserRepository } from '../interfaces/user/IUserRepository';
import { Enrollment } from '../models/enrollment';

export class EnrollmentRepository implements IEnrollmentRepository {
  constructor(
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository
  ) {}

  async createEnrollment(data: Partial<IEnrollment>): Promise<IEnrollment> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const existing = await Enrollment.findOne({
        course: data.course,
        student: data.student,
      }).session(session);

      if (existing) {
        throw new Error('User is already enrolled in this course.');
      }

      const [enrollment] = await Enrollment.create(
        [{
          ...data,
          enrollment_date: data.enrollment_date || new Date(),
          status: data.status || 'not-started',
        }],
        { session }
      );

      await session.commitTransaction();
      return enrollment.toObject();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
   async getAllEnrollments(): Promise<IEnrollment[] | null> {
    return Enrollment.find().lean();
  }

  async getEnrollment(enrollmentId: string): Promise<IEnrollment | null> {
    return Enrollment.findById(enrollmentId).populate('course student').lean();
  }

  async getEnrollmentsForCourse(courseId: string): Promise<IEnrollment[]> {
    return Enrollment.find({ course: courseId }).populate('student').lean();
  }

  async getEnrollmentsForUser(userId: string): Promise<IEnrollment[]> {
    return Enrollment.find({ student: userId }).populate('course').lean();
  }

  async hasEnrollmentForCourse(courseId: string, studentId: string): Promise<boolean> {
    const enrollment = await Enrollment.findOne({ course: courseId, student: studentId });
    return !!enrollment;
  }

  async findByCourseAndUser(courseId: string, userId: string): Promise<IEnrollment | null> {
    return await Enrollment.findOne({ course: courseId, student: userId });
  }
}