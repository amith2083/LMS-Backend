
import { IWatch } from "../interfaces/watch/IWatch";
import { IWatchServiceRepository } from "../interfaces/watch/IWatchRepository";
import { Watch } from "../models/watch";


export class WatchRepository implements IWatchServiceRepository {
  async findWatch(lessonId: string, moduleId: string, userId: string): Promise<IWatch | null> {
    const watch = await Watch.findOne({
      lesson: lessonId,
      module: moduleId,
      user: userId,
    });
    return watch;
  }
   async createWatch(watchData: Partial<IWatch>): Promise<IWatch> {
    return await Watch.create(watchData);
  }

  async updateWatchState(watchId: string, newState: string): Promise<IWatch | null> {
    return await Watch.findByIdAndUpdate(watchId, { state: newState }, { new: true });
  }
}
