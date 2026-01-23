import { Request, Response } from 'express';
import { IEnrollmentController } from '../interfaces/enrollment/IEnrollmentController';
import { IEnrollmentService } from '../interfaces/enrollment/IEnrollmentService';
import { STATUS_CODES } from '../constants/http';
import { AppError } from '../utils/asyncHandler';





export class EnrollmentController implements IEnrollmentController {
  constructor(private enrollmentService: IEnrollmentService) {}

  async createEnrollment(req: Request, res: Response): Promise<void> {
      if (!req.user) {
    throw new AppError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized');
  }
   const studentId = req.user.id
    

    const enrollmentData = { ...req.body, student: studentId };
    const result = await this.enrollmentService.createEnrollment(enrollmentData);

  if ('sessionUrl' in result) {
      res.json(result);
    } else {
      res.status(STATUS_CODES.CREATED).json(result);
    }
  }

  async confirmEnrollment(req:Request, res: Response): Promise<void> {
    const { session_id } = req.body;
    if (!session_id) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Session ID required');
    }
     if (!req.user) {
    throw new AppError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized');
  }
    const studenId = req.user.id
    
    const enrollment = await this.enrollmentService.confirmEnrollment(session_id, studenId);
    res.status(STATUS_CODES.CREATED).json(enrollment);
  }
  async getAllEnrollments(req: Request, res: Response): Promise<void> {
    const enrollments = await this.enrollmentService.getAllEnrollments();
    res.json(enrollments);
  }

  async getEnrollment(req: Request, res: Response): Promise<void> {
    const enrollment = await this.enrollmentService.getEnrollment(req.params.id);
    res.json(enrollment);
  }

  async getEnrollmentsForCourse(req: Request, res: Response): Promise<void> {
    const enrollments = await this.enrollmentService.getEnrollmentsForCourse(req.params.courseId);
    res.json(enrollments);
  }

  async getEnrollmentsForUser(req:Request, res: Response): Promise<void> {
      if (!req.user) {
    throw new AppError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized');
  }
   const studenId = req.user.id
    const enrollments = await this.enrollmentService.getEnrollmentsForUser(studenId);
    res.json(enrollments);
  }

  async hasEnrollmentForCourse(req:Request, res: Response): Promise<void> {
      if (!req.user) {
    throw new AppError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized');
  }
   const studenId = req.user.id
  
    const hasEnrollment = await this.enrollmentService.hasEnrollmentForCourse(
      req.params.courseId,
     studenId
    );
    res.json({ enrolled: hasEnrollment });
  }
}