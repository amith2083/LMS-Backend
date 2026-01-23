import { Request, Response } from 'express';
import { IWatchController } from '../interfaces/watch/IWatchController';
import { IWatchService } from '../interfaces/watch/IWatchService';
import { AppError } from '../utils/asyncHandler';
import { STATUS_CODES } from '../constants/http';


export class WatchController implements IWatchController {
  constructor(private watchService: IWatchService) {}

  async getWatch(req: Request, res: Response): Promise<void> {
    const { lessonId, moduleId } = req.params;
      if (!req.user) {
        throw new AppError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized');
      }
       const studenId = req.user.id
    
    const watch = await this.watchService.getWatch(lessonId, moduleId, studenId);
    res.json(watch || null);
  }

  async createWatch(req: Request, res: Response): Promise<void> {
    const { courseId, lessonId, moduleId, state, lastTime } = req.body;
      if (!req.user) {
        throw new AppError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized');
      }
       const studenId = req.user.id
      
    await this.watchService.handleWatchState(courseId, lessonId, moduleId, studenId, state, lastTime);
    res.json({ message: 'Watch record processed successfully' });
  }
}