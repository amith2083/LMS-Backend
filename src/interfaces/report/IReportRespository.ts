import { IReport } from "./IReport";

export interface IReportRepository {

 getReportByCourseAndUser(courseId: string, userId: string): Promise<IReport | null>;
create(data: Partial<IReport>): Promise<IReport>
  save(report: IReport): Promise<IReport> 
}
