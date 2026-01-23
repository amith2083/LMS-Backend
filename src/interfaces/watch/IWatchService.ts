import { IWatchDocument } from "../../models/watch";



export interface IWatchService {
  getWatch(
    lessonId: string,
    moduleId: string,
    userId: string
  ): Promise<IWatchDocument | null>;
  handleWatchState(
    courseId: string,
    lessonId: string,
    moduleId: string,
    userId: string,
    state: "started" | "completed",
    lastTime: number
  ): Promise<void>;
}
