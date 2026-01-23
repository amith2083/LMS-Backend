import { IWatchDocument } from "../../models/watch";
import { IWatch } from "../../types/watch";


export interface IWatchRepository {
  findWatch(
    lessonId: string,
    moduleId: string,
    userId: string
  ): Promise<IWatchDocument | null>;
  createWatch(watchData: Partial<IWatch>): Promise<IWatchDocument>;
  updateWatchState(watchId: string, newState: string): Promise<IWatchDocument | null>;
}
