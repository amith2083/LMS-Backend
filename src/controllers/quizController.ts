// src/controllers/quizController.ts
import { Request, Response } from 'express';
import { IQuizsetController } from '../interfaces/quiz/IQuizController';
import { IQuizsetService } from '../interfaces/quiz/IQuizService';
import { STATUS_CODES } from '../constants/http';

export class QuizsetController implements IQuizsetController {
  constructor(private quizsetService: IQuizsetService) {}

  async getQuizsets(req: Request, res: Response): Promise<void> {
    const excludeUnpublished = req.query.excludeUnpublished === 'true';
    const quizsets = await this.quizsetService.getQuizsets(excludeUnpublished);
    res.json(quizsets);
  }

  async getQuizsetById(req: Request, res: Response): Promise<void> {
    const quizset = await this.quizsetService.getQuizsetById(req.params.id);
    res.json(quizset);
  }

  async createQuizset(req: Request, res: Response): Promise<void> {
    const created = await this.quizsetService.createQuizset(req.body);
    res.status(STATUS_CODES.CREATED).json(created);
  }

  async updateQuizset(req: Request, res: Response): Promise<void> {
    const updated = await this.quizsetService.updateQuizset(req.params.id, req.body);
    res.json(updated);
  }

  async deleteQuizset(req: Request, res: Response): Promise<void> {
    await this.quizsetService.deleteQuizset(req.params.id);
    res.json({ message: 'Quizset deleted successfully' });
  }

  async addQuizToQuizset(req: Request, res: Response): Promise<void> {
    await this.quizsetService.addQuizToQuizset(req.params.id, req.body);
    res.status(STATUS_CODES.CREATED).json({ message: 'Quiz added' });
  }

  async deleteQuizFromQuizset(req: Request, res: Response): Promise<void> {
    await this.quizsetService.deleteQuizFromQuizset(req.params.quizsetId, req.params.quizId);
    res.json({ message: 'Quiz deleted' });
  }

  async togglePublishQuizset(req: Request, res: Response): Promise<void> {
    const active = await this.quizsetService.changeQuizsetPublishState(req.params.id);
    res.json({ active });
  }
}