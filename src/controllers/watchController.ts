import { Request, Response } from "express";
import { IWatchController } from "../interfaces/watch/IWatchController";
import { IWatchService } from "../interfaces/watch/IWatchService";

import { STATUS_CODES } from "../constants/http";
import { AppError } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "./enrollmentController";


export class WatchController implements IWatchController {
  constructor(private watchService: IWatchService) {}

  async getWatch(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) throw new AppError(STATUS_CODES.UNAUTHORIZED, "Unauthenticated");

      const { lessonId, moduleId } = req.params;
      const userId = req.user.id;

      const watch = await this.watchService.getWatch(lessonId, moduleId, userId);
      console.log('watch===',watch)
      res.status(200).json(watch || null);
    } catch (error: any) {
      throw new AppError(
        error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
        error.message || "Failed to fetch watch record"
      );
    }
  }
  async createWatch(req: Request, res: Response): Promise<void> {
    if (!req.user) throw new AppError(STATUS_CODES.UNAUTHORIZED, "Unauthenticated");
   

    const { courseId, lessonId, moduleId, state, lastTime } = req.body;

    if (state !== "started" && state !== "completed") {
      throw new AppError(STATUS_CODES.BAD_REQUEST, "Invalid state. Cannot process request");
    }

    await this.watchService.handleWatchState(courseId, lessonId, moduleId, req.user.id, state, lastTime);
    res.status(200).json({ message: "Watch record processed successfully" });
  }
}
