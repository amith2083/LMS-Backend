// src/controllers/enrollmentController.ts
import { Request, Response } from 'express';
import { IEnrollmentController } from '../interfaces/enrollment/IEnrollmentController';
import { IEnrollmentService } from '../interfaces/enrollment/IEnrollmentService';
import { STATUS_CODES } from '../constants/http';
import { AppError } from '../utils/asyncHandler';




export class EnrollmentController implements IEnrollmentController {
  constructor(private enrollmentService: IEnrollmentService) {}

  async createEnrollment(req: Request, res: Response): Promise<void> {
    if (req.user.isBlocked) {
      throw new AppError(STATUS_CODES.FORBIDDEN, 'User is blocked');
    }

    const enrollmentData = { ...req.body, student: req.user.id };
    const result = await this.enrollmentService.createEnrollment(enrollmentData);

  if ('sessionUrl' in result) {
      res.json(result);
    } else {
      res.status(STATUS_CODES.CREATED).json(result);
    }
  }

  async confirmEnrollment(req: Request, res: Response): Promise<void> {
    const { session_id } = req.body;
    if (!session_id) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Session ID required');
    }
    const enrollment = await this.enrollmentService.confirmEnrollment(session_id, req.user.id);
    res.status(STATUS_CODES.CREATED).json(enrollment);
  }


  async getEnrollment(req: Request, res: Response): Promise<void> {
    const enrollment = await this.enrollmentService.getEnrollment(req.params.id);
    res.json(enrollment);
  }

  async getEnrollmentsForCourse(req: Request, res: Response): Promise<void> {
    const enrollments = await this.enrollmentService.getEnrollmentsForCourse(req.params.courseId);
    res.json(enrollments);
  }

  async getEnrollmentsForUser(req: Request, res: Response): Promise<void> {
    const enrollments = await this.enrollmentService.getEnrollmentsForUser(req.user.id);
    res.json(enrollments);
  }

  async hasEnrollmentForCourse(req: Request, res: Response): Promise<void> {
  
    const hasEnrollment = await this.enrollmentService.hasEnrollmentForCourse(
      req.params.courseId,
      req.user.id
    );
    res.json({ enrolled: hasEnrollment });
  }
}