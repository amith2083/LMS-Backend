import { Report } from "../models/report";
import { Assessment } from "../models/assessment";
import { IReportRepository } from "../interfaces/report/IReportRespository";
import { IReport } from "../interfaces/report/IReport";

export class ReportRepository implements IReportRepository {
  async getReport(filter: any): Promise<IReport | null> {
    return Report.findOne(filter)
      .populate({ path: "quizAssessment", model: Assessment })
      .lean();
  }

  async getReportByCourseAndUser(courseId: string, userId: string): Promise<IReport | null> {
    return await Report.findOne({ course: courseId, student: userId });
  }

  async save(report: IReport): Promise<IReport> {
    await report.save();
    return report;
  }

  async create(data: Partial<IReport>): Promise<IReport> {
    const report = await Report.create(data);
    return report;
  }
}
