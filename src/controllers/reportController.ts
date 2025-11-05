import { Request, Response } from "express";
import { IReportController } from "../interfaces/report/IReportController";
import { IReportService } from "../interfaces/report/IReportService";
import { STATUS_CODES } from "../constants/http";

export class ReportController implements IReportController {
  constructor(private reportService: IReportService) {}

  async getReport(req: Request, res: Response): Promise<void> {
    const {courseId} = req.params;

    const report = await this.reportService.getReportByCourseAndUser(courseId,req.user.id);
    res.status(STATUS_CODES.OK).json(report);
  }

  async createWatchReport(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const report = await this.reportService.createWatchReport(data);
    res.status(STATUS_CODES.CREATED).json(report);
  }
}
