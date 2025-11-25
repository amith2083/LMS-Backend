import { IWatch } from "./IWatch";

export interface IWatchRepository {
  findWatch(
    lessonId: string,
    moduleId: string,
    userId: string
  ): Promise<IWatch | null>;
  createWatch(watchData: Partial<IWatch>): Promise<IWatch>;
  updateWatchState(watchId: string, newState: string): Promise<IWatch | null>;
}
