import { Request, Response } from 'express';
import { IQuizsetController } from '../interfaces/quiz/IQuizController';
import { IQuizService } from '../interfaces/quiz/IQuizService';
import { STATUS_CODES } from '../constants/http';

import { AppError } from '../utils/asyncHandler';

export class QuizsetController implements IQuizsetController {
  constructor(private quizService: IQuizService) {}

  async getQuizsets(req: Request, res: Response): Promise<void> {
      if (!req.user) {
        throw new AppError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized');
      }
       
    const instructorId = req.user.id
    
    const quizsets = await this.quizService.getQuizsets(instructorId);
    res.json(quizsets);
  }

  async getQuizsetById(req: Request, res: Response): Promise<void> {
    const quizset = await this.quizService.getQuizsetById(req.params.id);
    res.json(quizset);
  }

  async createQuizset(req: Request, res: Response): Promise<void> {
      if (!req.user) {
    throw new AppError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized');
  }
  const{title}=req.body
  
    const instructorId = req.user.id
    const created = await this.quizService.createQuizset({title},instructorId);
    res.status(STATUS_CODES.CREATED).json(created);
  }

  async updateQuizset(req: Request, res: Response): Promise<void> {
    const updated = await this.quizService.updateQuizset(req.params.id, req.body);
    res.json(updated);
  }
 async togglePublishQuizset(req: Request, res: Response): Promise<void> {
    const active = await this.quizService.changeQuizsetPublishState(req.params.id);
    res.json({ active });
  }
  async deleteQuizset(req: Request, res: Response): Promise<void> {
    await this.quizService.deleteQuizset(req.params.id);
    res.json({ message: 'Quizset deleted successfully' });
  }

  async createQuiz(req: Request, res: Response): Promise<void> {
    await this.quizService.createQuiz(req.params.id, req.body);
    res.status(STATUS_CODES.CREATED).json({ message: 'Quiz added' });
  }

  async removeQuizFromQuizset(req: Request, res: Response): Promise<void> {
    await this.quizService.removeQuizFromQuizset(req.params.quizsetId, req.params.quizId);
    res.json({ message: 'Quiz deleted' });
  }

 
}