
import { IWatch } from '../interfaces/watch/IWatch';
import { IWatchServiceRepository } from '../interfaces/watch/IWatchRepository';

import { Watch } from '../models/watch';

export class WatchRepository implements IWatchServiceRepository {
  async findWatch(lessonId: string, moduleId: string, userId: string): Promise<IWatch | null> {
    return Watch.findOne({ lesson: lessonId, module: moduleId, user: userId }).lean().exec();
  }

  async createWatch(watchData: Partial<IWatch>): Promise<IWatch> {
    const watch = await Watch.create(watchData);
    return watch.toObject();
  }

  async updateWatchState(watchId: string, newState: string): Promise<IWatch | null> {
    return Watch.findByIdAndUpdate(watchId, { state: newState }, { new: true }).lean().exec();
  }
}