import { IReportDocument } from "../../models/report";

export interface IReportService {
  getReportByCourseAndUser(
    courseId: string,
    userId: string,
  ): Promise<IReportDocument | null>;
  createWatchReport(data: any): Promise<IReportDocument>;
  updateReport(
    userId: string,
    courseId: string,
    moduleId: string,
    lessonId: string,
  ): Promise<void>;
}
