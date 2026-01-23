import { IReportDocument } from "../../models/report";
import { IReport } from "../../types/report";


export interface IReportRepository {

 getReportByCourseAndUser(courseId: string, userId: string): Promise<IReportDocument | null>;
create(data: Partial<IReport>): Promise<IReportDocument>
updateReport(
    reportId: string,
    update: Partial<IReport>
  ): Promise<IReportDocument | null>
}
