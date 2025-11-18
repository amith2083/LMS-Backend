
import { Request, Response } from 'express';
import { IWatchController } from '../interfaces/watch/IWatchController';
import { IWatchService } from '../interfaces/watch/IWatchService';


export class WatchController implements IWatchController {
  constructor(private watchService: IWatchService) {}

  async getWatch(req: Request, res: Response): Promise<void> {
    const { lessonId, moduleId } = req.params;
    const watch = await this.watchService.getWatch(lessonId, moduleId, req.user.id);
    res.json(watch || null);
  }

  async createWatch(req: Request, res: Response): Promise<void> {
    const { courseId, lessonId, moduleId, state, lastTime } = req.body;
    await this.watchService.handleWatchState(courseId, lessonId, moduleId, req.user.id, state, lastTime);
    res.json({ message: 'Watch record processed successfully' });
  }
}