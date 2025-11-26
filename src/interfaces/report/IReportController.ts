import { Request, Response } from "express";

export interface IReportController {
  getReport(req: Request, res: Response): Promise<void>;

}
