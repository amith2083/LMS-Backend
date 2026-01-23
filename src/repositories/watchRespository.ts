import { IWatchRepository } from '../interfaces/watch/IWatchRepository';
import { IWatchDocument, Watch } from '../models/watch';
import { IWatch } from '../types/watch';

export class WatchRepository implements IWatchRepository {
  async findWatch(lessonId: string, moduleId: string, userId: string): Promise<IWatchDocument | null> {
    return await Watch.findOne({ lesson: lessonId, module: moduleId, user: userId });
  }

  async createWatch(watchData: Partial<IWatch>): Promise<IWatchDocument> {
    const watch = await Watch.create(watchData);
    return watch;
  }

  async updateWatchState(watchId: string, newState: string): Promise<IWatchDocument | null> {
    return await Watch.findByIdAndUpdate(watchId, { state: newState }, { new: true });
  }
}