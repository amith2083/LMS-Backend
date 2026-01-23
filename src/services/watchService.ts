import { AppError } from '../utils/asyncHandler';
import { IWatchRepository } from '../interfaces/watch/IWatchRepository';
import { IReportService } from '../interfaces/report/IReportService';
import { STATUS_CODES } from '../constants/http';
import { IWatchService } from '../interfaces/watch/IWatchService';
import { IWatchDocument } from '../models/watch';



export class WatchService implements IWatchService {
  constructor(
    private watchRepository: IWatchRepository,
    private reportService: IReportService
  ) {}

  async getWatch(lessonId: string, moduleId: string, userId: string): Promise<IWatchDocument | null> {
    return this.watchRepository.findWatch(lessonId, moduleId, userId);
  }

  async handleWatchState(
    courseId: string,
    lessonId: string,
    moduleId: string,
    userId: string,
    state: 'started' | 'completed',
    lastTime: number
  ): Promise<void> {
    if (!['started', 'completed'].includes(state)) {
      throw new AppError(STATUS_CODES.BAD_REQUEST, 'Invalid state');
    }

    const found = await this.watchRepository.findWatch(lessonId, moduleId, userId);
    const watchEntry = { lesson: lessonId, module: moduleId, user: userId, state, lastTime };

    if (state === 'started') {
      if (!found) {
        await this.watchRepository.createWatch(watchEntry);
      }
    } else if (state === 'completed') {
      if (!found) {
        await this.watchRepository.createWatch(watchEntry);
        await this.reportService.updateReport(userId, courseId, moduleId, lessonId);
      } else if (found.state === 'started') {
        await this.watchRepository.updateWatchState(found._id.toString(), 'completed');
        await this.reportService.updateReport(userId, courseId, moduleId, lessonId);
      }
    }
  }
}