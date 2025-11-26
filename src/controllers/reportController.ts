
import { Request, Response } from 'express';
import { IReportController } from '../interfaces/report/IReportController';
import { IReportService } from '../interfaces/report/IReportService';


export class ReportController implements IReportController {
  constructor(private reportService: IReportService) {}

  async getReport(req: Request, res: Response): Promise<void> {
    const { courseId } = req.params;
    const studenId = req.user.id
    const report = await this.reportService.getReportByCourseAndUser(courseId, studenId);
    res.json(report);
  }

 
}