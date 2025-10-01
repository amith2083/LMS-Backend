import { IQuizsetController } from "../interfaces/quiz/IQuizController";
import { IQuizsetService } from "../interfaces/quiz/IQuizService";
import { Request, Response } from "express";
import { STATUS_CODES } from "../constants/http";
import { ERROR_MESSAGES } from "../constants/messages";


export class QuizsetController implements IQuizsetController {
  constructor(private quizsetService: IQuizsetService) {}

  async getQuizsets(req: Request, res: Response): Promise<void> {
    const quizsets = await this.quizsetService.getQuizsets(false);
    res.status(STATUS_CODES.OK).json(quizsets);
  }

  async getQuizsetById(req: Request, res: Response): Promise<void> {
    const quizset = await this.quizsetService.getQuizsetById(req.params.id);
    if (!quizset) {
      res.status(STATUS_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.NOT_FOUND });
      return;
    }
    res.status(STATUS_CODES.OK).json(quizset);
  }

  async createQuizset(req: Request, res: Response): Promise<void> {
    const created = await this.quizsetService.createQuizset(req.body);
    res.status(STATUS_CODES.CREATED).json(created);
  }

  async updateQuizset(req: Request, res: Response): Promise<void> {
    const updated = await this.quizsetService.updateQuizset(req.params.id, req.body);
    res.status(STATUS_CODES.OK).json(updated);
  }

  async deleteQuizset(req: Request, res: Response): Promise<void> {
    await this.quizsetService.deleteQuizset(req.params.id);
    res.status(STATUS_CODES.OK).send();
  }

  async addQuizToQuizset(req: Request, res: Response): Promise<void> {
    const { quizsetId } = req.params;
    const quizData = req.body;
    console.log('Received quizsetId:', quizsetId);
    console.log('Received quizData:', quizData);
    await this.quizsetService.addQuizToQuizset(req.params.id, req.body);
    res.status(STATUS_CODES.CREATED).send();
  }

  async deleteQuizFromQuizset(req: Request, res: Response): Promise<void> {
    await this.quizsetService.deleteQuizFromQuizset(req.params.quizsetId, req.params.quizId);
    res.status(STATUS_CODES.OK).send();
  }

  async togglePublishQuizset(req: Request, res: Response): Promise<void> {
    const state = await this.quizsetService.changeQuizsetPublishState(req.params.id);
    res.status(STATUS_CODES.OK).json({ active: state });
  }
}
