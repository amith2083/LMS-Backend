
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  details?: any;
}

export type ErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => void;

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
  errorHandler?: ErrorHandler
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      if (errorHandler) {
        errorHandler(error, req, res, next);
        return;
      }

      console.error(error);
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const response: ErrorResponse = {
        success: false,
        message: error.message || 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      };
      res.status(statusCode).json(response);
    });
  };
};
// import { Request, Response, NextFunction } from 'express';

// export const asyncHandler = (fn: Function) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await fn(req, res, next);
//     } catch (error: any) {
//       console.error(error);
//       res.status(error.statusCode || 500).json({
//         success: false,
//         message: error.message || 'Internal Server Error',
//       });
//     }
//   };
// };





// import { Request, Response, NextFunction } from "express";

// export const asyncHandler = (
//   fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
// ) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
// };
