
import { Request, Response } from 'express';
import { IReportController } from '../interfaces/report/IReportController';
import { IReportService } from '../interfaces/report/IReportService';

import { AppError } from '../utils/asyncHandler';
import { STATUS_CODES } from '../constants/http';


export class ReportController implements IReportController {
  constructor(private reportService: IReportService) {}

  async getReport(req: Request, res: Response): Promise<void> {
    const { courseId } = req.params;
      if (!req.user) {
        throw new AppError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized');
      }
       const studenId = req.user.id
    
    const report = await this.reportService.getReportByCourseAndUser(courseId, studenId);
    res.json(report);
  }

 
}