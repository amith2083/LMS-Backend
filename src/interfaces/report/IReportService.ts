import { IReport } from "./IReport";

export interface IReportService {
getReportByCourseAndUser(courseId: string, userId: string): Promise<IReport | null>
  createWatchReport(data: any): Promise<IReport>;
  updateReport(userId: string, courseId: string, moduleId: string, lessonId: string): Promise<void>;
}
