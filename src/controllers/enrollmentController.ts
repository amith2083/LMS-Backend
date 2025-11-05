import { IEnrollmentController } from "../interfaces/enrollment/IEnrollmentController";
import { IEnrollmentService } from "../interfaces/enrollment/IEnrollmentService";
import { Request, Response } from "express";
import { STATUS_CODES } from "../constants/http";
import { AppError } from "../utils/asyncHandler";
import { IEnrollment } from "../interfaces/enrollment/IEnrollment";
import jwt from "jsonwebtoken";


export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string; isVerified?: boolean; isBlocked?: boolean };
}
interface OptionalUserRequest extends Request {
  user?: { id: string; role?: string; isBlocked?: boolean; /* add other fields */ };
}

export class EnrollmentController implements IEnrollmentController {
  private enrollmentService: IEnrollmentService;

  constructor(enrollmentService: IEnrollmentService) {
    this.enrollmentService = enrollmentService;
  }

async createEnrollment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(STATUS_CODES.UNAUTHORIZED, "Unauthenticated");
      }

      if (req.user.isBlocked) {
        throw new AppError(STATUS_CODES.FORBIDDEN, "User is blocked");
      }

      const enrollmentData: Partial<IEnrollment> = {
        ...req.body,
        student: req.user.id,
      };
      const result = await this.enrollmentService.createEnrollment(enrollmentData);
      if ('sessionUrl' in result) {
        res.status(200).json(result); // Return { sessionUrl }
      } else {
        res.status(201).json(result); // Return enrollment
      }
    } catch (error: any) {
      throw new AppError(
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
        error.message || "Failed to create enrollment"
      );
    }
  }

  async confirmEnrollment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(STATUS_CODES.UNAUTHORIZED, "Unauthenticated");
      }
      const { session_id } = req.body;
      if (!session_id) {
        throw new AppError(STATUS_CODES.BAD_REQUEST, "Session ID required");
      }
      const enrollment = await this.enrollmentService.confirmEnrollment(session_id, req.user.id);
      res.status(201).json(enrollment);
    } catch (error: any) {
      throw new AppError(
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
        error.message || "Failed to confirm enrollment"
      );
    }
  }

  async getEnrollment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(STATUS_CODES.UNAUTHORIZED, "Unauthenticated");
      }
      const enrollment = await this.enrollmentService.getEnrollment(req.params.id);
      res.status(200).json(enrollment);
    } catch (error: any) {
      throw new AppError(
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
        error.message || "Failed to fetch enrollment"
      );
    }
  }

  async getEnrollmentsForCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(STATUS_CODES.UNAUTHORIZED, "Unauthenticated");
      }
      const enrollments = await this.enrollmentService.getEnrollmentsForCourse(req.params.courseId);
      res.status(200).json(enrollments);
    } catch (error: any) {
      throw new AppError(
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
        error.message || "Failed to fetch enrollments"
      );
    }
  }

  async getEnrollmentsForUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(STATUS_CODES.UNAUTHORIZED, "Unauthenticated");
      }
      const enrollments = await this.enrollmentService.getEnrollmentsForUser(req.user.id);
      res.status(200).json(enrollments);
    } catch (error: any) {
      throw new AppError(
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
        error.message || "Failed to fetch enrollments"
      );
    }
  }
//   async hasEnrollmentForCourse(req: AuthenticatedRequest, res: Response): Promise<void> {
//   try {
//     // if (!req.user) {
//     //   throw new AppError(STATUS_CODES.UNAUTHORIZED, "Unauthenticated");
//     // }
//     if (!req.user) {
//          res.status(200).json({ enrolled: false });
//          return
//       }

//     const courseId = req.params.courseId;
//     const studentId = req.user.id;

//     const hasEnrollment = await this.enrollmentService.hasEnrollmentForCourse(courseId, studentId);
//     res.status(200).json({ enrolled: hasEnrollment });
//   } catch (error: any) {
//     throw new AppError(
//       error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
//       error.message || "Failed to check enrollment"
//     );
//   }
// }
async hasEnrollmentForCourse(req: OptionalUserRequest, res: Response): Promise<void> {
    let user = req.user;  // Starts as undefined
  
    // Manual optional auth: Verify token if not already set
    if (!user) {
      const accessToken = req.cookies.accessToken;
      if (accessToken) {
        try {
          const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as {
            id: string;
            role: string;
            // Add other expected payload fields here
          };
          user = decoded;  // Now user = { id: 'user123', role: 'student', ... }
          req.user = user;  // Set on req for consistency (optional)
          console.log('🤗😁', user);  // Your debug log
        } catch (error) {
          console.error("Invalid or expired access token (optional auth skipped)");
          user = undefined;  // Treat as unauthenticated
        }
      }
    }

    try {
      if (!user) {
        // No user: Guest or invalid token → Not enrolled
        res.status(200).json({ enrolled: false });
        return;
      }

      const courseId = req.params.courseId;
      const studentId = user.id;  // ✅ Now available from decoded token

      const hasEnrollment = await this.enrollmentService.hasEnrollmentForCourse(courseId, studentId);
      res.status(200).json({ enrolled: hasEnrollment });
    } catch (error: any) {
      throw new AppError(
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
        error.message || "Failed to check enrollment"
      );
    }
  }




}
