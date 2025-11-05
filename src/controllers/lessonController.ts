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
  async getLessonBySlug(req: Request, res: Response): Promise<void> {
   
    const lesson = await this.lessonService.getLessonBySlug(req.params.slug);
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

  async deleteLesson(req: Request, res: Response): Promise<void> {
    await this.lessonService.deleteLesson(
      req.params.id,
      req.query.moduleId as string
    );
    res
      .status(STATUS_CODES.OK)
      .json({ message: "Lesson deleted successfully" });
  }
  async getUploadSignedUrl(req: Request, res: Response): Promise<void> {
    const { fileName, fileType } = req.body;
    const data = await this.lessonService.getUploadSignedUrl(
      fileName,
      fileType
    );
    res.status(200).json(data);
  }

  async getPlaybackSignedUrl(req: Request, res: Response): Promise<void> {
    const { key } = req.body;
    const data = await this.lessonService.getPlaybackSignedUrl(key);
    res.status(200).json(data);
  }
}
