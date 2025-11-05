import { IWatch } from "../interfaces/watch/IWatch";
import { IWatchServiceRepository } from "../interfaces/watch/IWatchRepository";
import { IWatchService } from "../interfaces/watch/IWatchService";
import { IReportService } from "../interfaces/report/IReportService";

export class WatchService implements IWatchService {
  constructor(
    private readonly watchRepository: IWatchServiceRepository,
    private readonly reportService: IReportService
  ) {}

  async getWatch(lessonId: string, moduleId: string, userId: string): Promise<IWatch | null> {
    return this.watchRepository.findWatch(lessonId, moduleId, userId);
  }

  async handleWatchState(
    courseId: string,
    lessonId: string,
    moduleId: string,
    userId: string,
    state: "started" | "completed",
    lastTime: number
  ): Promise<void> {
    const found = await this.watchRepository.findWatch(lessonId, moduleId, userId);

    const watchEntry = { lesson: lessonId, module: moduleId, user: userId, state, lastTime };

    if (state === "started") {
      if (!found) {
        await this.watchRepository.createWatch(watchEntry);
      }
    } else if (state === "completed") {
      if (!found) {
        await this.watchRepository.createWatch(watchEntry);
        await this.reportService.updateReport(userId, courseId, moduleId, lessonId);
      } else if (found.state === "started") {
        await this.watchRepository.updateWatchState(found._id as string, "completed");
        await this.reportService.updateReport(userId, courseId, moduleId, lessonId);
      }
    }
  }
}
