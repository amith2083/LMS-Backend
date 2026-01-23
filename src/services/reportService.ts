import { AppError } from '../utils/asyncHandler';
import { IReportRepository } from '../interfaces/report/IReportRespository';
import { ICourseRepository } from '../interfaces/course/ICourseRepository';
import { IModuleRepository } from '../interfaces/module/IModuleRepository';
import { STATUS_CODES } from '../constants/http';
import { IReportService } from '../interfaces/report/IReportService';
import { IReport } from '../types/report';
import { IReportDocument } from '../models/report';



export class ReportService implements IReportService {
  constructor(
    private reportRepository: IReportRepository,
    private courseRepository: ICourseRepository,
    private moduleRepository: IModuleRepository
  ) {}

  async getReportByCourseAndUser(courseId: string, userId: string): Promise<IReportDocument|null> {
    const report = await this.reportRepository.getReportByCourseAndUser(courseId, userId);
    if (!report) return null;
    return report;
  }

  // async createWatchReport(data: any): Promise<IReport> {
  //   let report = await this.reportRepository.getReportByCourseAndUser(data.courseId, data.userId);
  //   if (!report) {
  //     report = await this.reportRepository.create({ course: data.courseId, student: data.userId });
  //   }

  //   report.totalCompletedLessons ??= [];
  //   report.totalCompletedModules ??= [];

     

  //   if (!report.totalCompletedLessons.some(id => id.equals(data.lessonId))) {
  //     report.totalCompletedLessons.push(data.lessonId);
  //   }

  //   const module = await this.moduleRepository.getModule(data.moduleId);
  //   if (!module) throw new AppError(STATUS_CODES.NOT_FOUND, 'Module not found');

  //   const completedLessonIds = report.totalCompletedLessons.map(id => id.toString());
  //   const isModuleComplete = module.lessonIds.every(l => completedLessonIds.includes(l.toString()));
  //   if (isModuleComplete && !report.totalCompletedModules.some(id => id.equals(data.moduleId))) {
  //     report.totalCompletedModules.push(data.moduleId);
  //   }

  //   const course = await this.courseRepository.getCourse(data.courseId);
  //   if (!course) throw new AppError(STATUS_CODES.NOT_FOUND, 'Course not found');

  //   const totalModules = course.modules?.length ?? 0;
  //   const completedModules = report.totalCompletedModules.length;
  //   if (completedModules > 0 && completedModules === totalModules) {
  //     report.completion_date = new Date();
  //   }

  //   await this.reportRepository.save(report);
  //   return report;
  // }
  async createWatchReport(data: any): Promise<IReportDocument> {

  // 1. Get or create report
  let report = await this.reportRepository.getReportByCourseAndUser(
    data.courseId,
    data.userId
  );

  if (!report) {
    report = await this.reportRepository.create({
      course: data.courseId,
      student: data.userId,
      totalCompletedLessons: [],
      totalCompletedModules: [],
    });
  }

  // Clone arrays (no direct mutation of document)
  const completedLessons = report.totalCompletedLessons?.map(id => id.toString()) ?? [];
  const completedModules = report.totalCompletedModules?.map(id => id.toString()) ?? [];

  // 2. Add lesson if not exists
  if (!completedLessons.includes(data.lessonId.toString())) {
    completedLessons.push(data.lessonId.toString());
  }

  // 3. Module completion logic
  const module = await this.moduleRepository.getModule(data.moduleId);
  if (!module) {
    throw new AppError(STATUS_CODES.NOT_FOUND, 'Module not found');
  }

  const isModuleComplete = module?.lessonIds?.every(lessonId =>
    completedLessons.includes(lessonId.toString())
  );

  if (
    isModuleComplete &&
    !completedModules.includes(data.moduleId.toString())
  ) {
    completedModules.push(data.moduleId.toString());
  }

  // 4. Course completion logic
  const course = await this.courseRepository.getCourse(data.courseId);
  if (!course) {
    throw new AppError(STATUS_CODES.NOT_FOUND, 'Course not found');
  }

  const totalModules = course.modules?.length ?? 0;
  const completionDate =
    completedModules.length > 0 &&
    completedModules.length === totalModules
      ? new Date()
      : report.completionDate;

 
  const updatedReport = await this.reportRepository.updateReport(
    report._id.toString(),
    {
      totalCompletedLessons: completedLessons,
      totalCompletedModules: completedModules,
      completionDate: completionDate,
    }
  );

  if (!updatedReport) {
    throw new AppError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to update report');
  }

  return updatedReport;
}


  async updateReport(userId: string, courseId: string, moduleId: string, lessonId: string): Promise<void> {
    await this.createWatchReport({ userId, courseId, moduleId, lessonId });
  }
}