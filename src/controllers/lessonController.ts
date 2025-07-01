import { Request, Response } from "express";
import { ILessonController } from "../interfaces/lesson/ILessonController";
import { ILessonService } from "../interfaces/lesson/ILessonService";
import { STATUS_CODES } from "../constants/http";
import { ERROR_MESSAGES } from "../constants/messages";

export class LessonController implements ILessonController {
  constructor(private lessonService: ILessonService) {}

  async createLesson(req: Request, res: Response): Promise<void> {
    const lesson = await this.lessonService.createLesson(
      req.body,
      req.query.moduleId as string
    );
    res.status(STATUS_CODES.CREATED).json(lesson);
  }

  async getLesson(req: Request, res: Response): Promise<void> {
    const lesson = await this.lessonService.getLesson(req.params.id);
    if (!lesson) {
      res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: ERROR_MESSAGES.NOT_FOUND });
      return;
    }
    res.status(STATUS_CODES.OK).json(lesson);
  }

  async updateLesson(req: Request, res: Response): Promise<void> {
    const updated = await this.lessonService.updateLesson(
      req.params.id,
      req.body
    );
    res.status(STATUS_CODES.OK).json(updated);
  }

  async changeLessonPublishState(req: Request, res: Response): Promise<void> {
    const status = await this.lessonService.changeLessonPublishState(
      req.params.id
    );
    res.status(STATUS_CODES.OK).json({ status });
  }

  async deleteLesson(req: Request, res: Response): Promise<void> {
    await this.lessonService.deleteLesson(
      req.params.id,
      req.query.moduleId as string
    );
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Lesson deleted successfully" });
  }
}
