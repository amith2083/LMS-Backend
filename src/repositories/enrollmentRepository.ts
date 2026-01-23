
import mongoose from 'mongoose';
import { IEnrollment } from '../interfaces/enrollment/IEnrollment';
import { IEnrollmentRepository } from '../interfaces/enrollment/IEnrollmentRepository';
import { ICourseRepository } from '../interfaces/course/ICourseRepository';
import { IUserRepository } from '../interfaces/user/IUserRepository';
import { Enrollment, IEnrollmentDocument } from '../models/enrollment';

export class EnrollmentRepository implements IEnrollmentRepository {
  constructor(
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository
  ) {}

  async createEnrollment(data:IEnrollment): Promise<IEnrollmentDocument> {
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

      const [created] = await Enrollment.create(
        [{
          ...data,
          enrollment_date: data.enrollment_date || new Date(),
          status: data.status || 'not-started',
        }],
        { session }
      );
const enrollment = await Enrollment.findById(created._id)
      .populate({
        path: "course",
        select: "_id title price",
      })
      .populate({
        path: "student",
        select: "_id name email",
      })
      .session(session)
      .orFail();
      await session.commitTransaction();
      return enrollment;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
   async getAllEnrollments(): Promise<IEnrollmentDocument[]> {
    return await Enrollment.find();
  }

  async getEnrollment(enrollmentId: string): Promise<IEnrollmentDocument | null> {
    return await Enrollment.findById(enrollmentId).populate({
      path: "course",
      select: "_id title price",
    })
    .populate({
      path: "student",
      select: "_id name email",
    });
  }

  async getEnrollmentsForCourse(courseId: string): Promise<IEnrollmentDocument[]> {
    return Enrollment.find({ course: courseId }).populate('student');
  }

  async getEnrollmentsForUser(userId: string): Promise<IEnrollmentDocument[]> {
    return Enrollment.find({ student: userId }).populate('course');
  }

  async hasEnrollmentForCourse(courseId: string, studentId: string): Promise<boolean> {
    const enrollment = await Enrollment.findOne({ course: courseId, student: studentId });
    return !!enrollment;
  }

  async findByCourseAndUser(courseId: string, userId: string): Promise<IEnrollmentDocument| null> {
    return await Enrollment.findOne({ course: courseId, student: userId });
  }
}