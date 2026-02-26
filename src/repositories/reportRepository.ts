

import { IReportRepository } from '../interfaces/report/IReportRespository';
import { IReportDocument, Report } from '../models/report';
import { Assessment } from '../models/assessment';
import { IReport } from '../types/report';


export class ReportRepository implements IReportRepository {
  async getReport(data: any): Promise<IReportDocument | null> {
    return await Report.findOne(data).populate({ path: 'quizAssessment', model: Assessment });
  }

  async getReportByCourseAndUser(courseId: string, userId: string): Promise<IReportDocument | null> {
    return await Report.findOne({ course: courseId, student: userId }).populate({ path: 'quizAssessment', model: Assessment });;
  }

 

  async create(data: Partial<IReport>): Promise<IReportDocument> {
    const report = await Report.create(data);
    return report;
  }
  async updateReport(
    reportId: string,
    update: Partial<IReport>
  ): Promise<IReportDocument | null> {
    return await Report.findByIdAndUpdate(
      reportId,
      { $set: update },
      { new: true }
    );
  }
}