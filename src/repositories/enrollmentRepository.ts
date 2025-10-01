
import mongoose from "mongoose";
import { IEnrollment } from "../interfaces/enrollment/IEnrollment";
import { IEnrollmentRepository } from "../interfaces/enrollment/IEnrollmentRepository";
import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import { Enrollment } from "../models/enrollment";

export class EnrollmentRepository implements IEnrollmentRepository {
  constructor(
    private courseRepository: ICourseRepository,
    private userRepository: IUserRepository
  ) {}

  async createEnrollment(data: Partial<IEnrollment>): Promise<IEnrollment> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const existingEnrollment = await Enrollment.findOne({
        course: data.course,
        student: data.student,
      }).session(session);

      if (existingEnrollment) {
        throw new Error("User is already enrolled in this course.");
      }

      const [newEnrollment] = await Enrollment.create(
        [
          {
            ...data,
            enrollment_date: data.enrollment_date || Date.now(),
            status: data.status || "not-started",
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();
      return newEnrollment.toObject();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getEnrollment(enrollmentId: string): Promise<IEnrollment | null> {
    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("course student")
      .lean();
    return enrollment ? enrollment : null;
  }

  async getEnrollmentsForCourse(courseId: string): Promise<IEnrollment[]> {
    const enrollments = await Enrollment.find({ course: courseId })
      .populate("student")
      .lean();
    return enrollments;
  }

  async getEnrollmentsForUser(userId: string): Promise<IEnrollment[]> {
    const enrollments = await Enrollment.find({ student: userId })
      .populate("course")
      .lean();
    return enrollments;
  }

  // async updateEnrollment(
  //   enrollmentId: string,
  //   data: Partial<IEnrollment>
  // ): Promise<IEnrollment | null> {
  //   const updatedEnrollment = await Enrollment.findByIdAndUpdate(enrollmentId, data, {
  //     new: true,
  //   })
  //     .populate("course student")
  //     .lean();
  //   return updatedEnrollment ? updatedEnrollment : null;
  // }

  // async deleteEnrollment(enrollmentId: string): Promise<void> {
  //   const enrollment = await Enrollment.findByIdAndDelete(enrollmentId);
  //   if (!enrollment) {
  //     throw new Error("Enrollment not found or failed to delete");
  //   }
  // }

  async findByCourseAndUser(
    courseId: string,
    userId: string
  ): Promise<IEnrollment | null> {
    const enrollment = await Enrollment.findOne({
      course: courseId,
      student: userId,
    }).lean();
    return enrollment ? enrollment : null;
  }
}
