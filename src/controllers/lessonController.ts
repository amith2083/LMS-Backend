// src/controllers/lessonController.ts
import { Request, Response } from 'express';
import { ILessonController } from '../interfaces/lesson/ILessonController';
import { ILessonService } from '../interfaces/lesson/ILessonService';
import { STATUS_CODES } from '../constants/http';

export class LessonController implements ILessonController {
  constructor(private lessonService: ILessonService) {}

  async createLesson(req: Request, res: Response): Promise<void> {
    const lesson = await this.lessonService.createLesson(req.body, req.query.moduleId as string);
    res.status(STATUS_CODES.CREATED).json(lesson);
  }

  async getLesson(req: Request, res: Response): Promise<void> {
    const lesson = await this.lessonService.getLesson(req.params.id);
    res.json(lesson);                     // <-- service already threw 404 if missing
  }

  async getLessonBySlug(req: Request, res: Response): Promise<void> {
    const lesson = await this.lessonService.getLessonBySlug(req.params.slug);
    res.json(lesson);
  }

  async updateLesson(req: Request, res: Response): Promise<void> {
    const{id}= req.params
     
    const updated = await this.lessonService.updateLesson(id, req.body);
   
    res.json(updated);
  }

  async deleteLesson(req: Request, res: Response): Promise<void> {
    await this.lessonService.deleteLesson(req.params.id, req.query.moduleId as string);
    res.json({ message: 'Lesson deleted successfully' });
  }

  async getUploadSignedUrl(req: Request, res: Response): Promise<void> {
    const { fileName, fileType } = req.body;
    const data = await this.lessonService.getUploadSignedUrl(fileName, fileType);
    res.json(data);
  }

  async getPlaybackSignedUrl(req: Request, res: Response): Promise<void> {
    const { key } = req.body;
    const data = await this.lessonService.getPlaybackSignedUrl(key);
    res.json(data);
  }
}