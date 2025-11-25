
import { IReport } from '../interfaces/report/IReport';
import { IReportRepository } from '../interfaces/report/IReportRespository';
import { Report } from '../models/report';
import { Assessment } from '../models/assessment';


export class ReportRepository implements IReportRepository {
  async getReport(filter: any): Promise<IReport | null> {
    return Report.findOne(filter).populate({ path: 'quizAssessment', model: Assessment });
  }

  async getReportByCourseAndUser(courseId: string, userId: string): Promise<IReport | null> {
    return Report.findOne({ course: courseId, student: userId });
  }

  async save(report: IReport): Promise<IReport> {
    await (report as any).save();
    return report;
  }

  async create(data: Partial<IReport>): Promise<IReport> {
    const report = await Report.create(data);
    return report.toObject();
  }
}