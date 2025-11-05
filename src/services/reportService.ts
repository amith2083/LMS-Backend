import mongoose from "mongoose";
import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { IModuleRepository } from "../interfaces/module/IModuleRepository";
import { IReportRepository } from "../interfaces/report/IReportRespository";
import { IReportService } from "../interfaces/report/IReportService";
import { IReport } from "../interfaces/report/IReport";

export class ReportService implements IReportService {
  constructor(
    private readonly reportRepository: IReportRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly moduleRepository: IModuleRepository
  ) {}

  async getReportByCourseAndUser(courseId: string, userId: string): Promise<IReport | null> {
    return this.reportRepository.getReportByCourseAndUser(courseId,userId);
  }

  async createWatchReport(data: any): Promise<IReport> {
    let report = await this.reportRepository.getReportByCourseAndUser(data.courseId, data.userId);
    if (!report) {
      report = await this.reportRepository.create({
        course: data.courseId,
        student: data.userId,
      });
    }

    report.totalCompletedLessons ??= [];
    report.totalCompletedModules ??= [];

    // Mark lesson as completed
    if (!report.totalCompletedLessons.includes(data.lessonId)) {
      report.totalCompletedLessons.push(new mongoose.Types.ObjectId(data.lessonId));
    }

    // Check module completion
    const module = await this.moduleRepository.getModule(data.moduleId);
    if (!module) throw new Error("Module not found");
    const completedLessonIds = report.totalCompletedLessons.map(String);
    const isModuleComplete = module.lessonIds.every((l: any) =>
      completedLessonIds.includes(l.toString())
    );
    if (isModuleComplete && !report.totalCompletedModules.includes(data.moduleId)) {
      report.totalCompletedModules.push(new mongoose.Types.ObjectId(data.moduleId));
    }

    // Check course completion
    const course = await this.courseRepository.getCourse(data.courseId);
    if (!course) throw new Error("Course not found");

    const totalModules = course.modules?.length ?? 0;
    const completedModules = report.totalCompletedModules?.length ?? 0;

    if (completedModules >= 1 && completedModules === totalModules) {
      report.completion_date = new Date();
    }

    await this.reportRepository.save(report);
    return report;
  }

  async updateReport(userId: string, courseId: string, moduleId: string, lessonId: string): Promise<void> {
    await this.createWatchReport({ userId, courseId, moduleId, lessonId });
  }
}
