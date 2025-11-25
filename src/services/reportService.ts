import { AppError } from '../utils/asyncHandler';
import { IReport } from '../interfaces/report/IReport';
import { IReportRepository } from '../interfaces/report/IReportRespository';
import { ICourseRepository } from '../interfaces/course/ICourseRepository';
import { IModuleRepository } from '../interfaces/module/IModuleRepository';
import { STATUS_CODES } from '../constants/http';
import { IReportService } from '../interfaces/report/IReportService';



export class ReportService implements IReportService {
  constructor(
    private reportRepository: IReportRepository,
    private courseRepository: ICourseRepository,
    private moduleRepository: IModuleRepository
  ) {}

  async getReportByCourseAndUser(courseId: string, userId: string): Promise<IReport> {
    const report = await this.reportRepository.getReportByCourseAndUser(courseId, userId);
    // if (!report) throw new AppError(STATUS_CODES.NOT_FOUND, 'Report not found');
    return report;
  }

  async createWatchReport(data: any): Promise<IReport> {
    let report = await this.reportRepository.getReportByCourseAndUser(data.courseId, data.userId);
    if (!report) {
      report = await this.reportRepository.create({ course: data.courseId, student: data.userId });
    }

    report.totalCompletedLessons ??= [];
    report.totalCompletedModules ??= [];

     

    if (!report.totalCompletedLessons.some(id => id.equals(data.lessonId))) {
      report.totalCompletedLessons.push(data.lessonId);
    }

    const module = await this.moduleRepository.getModule(data.moduleId);
    if (!module) throw new AppError(STATUS_CODES.NOT_FOUND, 'Module not found');

    const completedLessonIds = report.totalCompletedLessons.map(id => id.toString());
    const isModuleComplete = module.lessonIds.every(l => completedLessonIds.includes(l.toString()));
    if (isModuleComplete && !report.totalCompletedModules.some(id => id.equals(data.moduleId))) {
      report.totalCompletedModules.push(data.moduleId);
    }

    const course = await this.courseRepository.getCourse(data.courseId);
    if (!course) throw new AppError(STATUS_CODES.NOT_FOUND, 'Course not found');

    const totalModules = course.modules?.length ?? 0;
    const completedModules = report.totalCompletedModules.length;
    if (completedModules > 0 && completedModules === totalModules) {
      report.completion_date = new Date();
    }

    await this.reportRepository.save(report);
    return report;
  }

  async updateReport(userId: string, courseId: string, moduleId: string, lessonId: string): Promise<void> {
    await this.createWatchReport({ userId, courseId, moduleId, lessonId });
  }
}