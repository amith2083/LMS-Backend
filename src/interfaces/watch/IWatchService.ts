import { IWatch } from "./IWatch";

export interface IWatchService {
  getWatch(
    lessonId: string,
    moduleId: string,
    userId: string
  ): Promise<IWatch | null>;
  handleWatchState(
    courseId: string,
    lessonId: string,
    moduleId: string,
    userId: string,
    state: "started" | "completed",
    lastTime: number
  ): Promise<void>;
}
